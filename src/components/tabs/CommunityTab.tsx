import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CommunityPost } from '../../types';
import { CommunityStore } from '../../services/community';
import { encodeTemplateToShareLink } from '../../lib/shareLink';
import { generatePayload } from '../../lib/payload';
import { useAuth } from '../../hooks/useAuth';
import { Corner } from '../../art/Corner';
import { Lotus } from '../../art/Lotus';
import { EmptyStateScene } from '../ui/EmptyStateScene';
import {
  Heart,
  GitFork,
  MessageCircle,
  Flag,
  Share2,
  Check,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  Send,
  Info,
} from 'lucide-react';

interface CommunityTabProps {
  onRemixSuccess?: () => void;
}

const PostCard: React.FC<{
  post: CommunityPost;
  onLike: (id: string) => void;
  onRemix: (post: CommunityPost) => void;
  onReport: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
  isFollowing: boolean;
  onToggleFollow: (authorId: string) => void;
}> = ({ post, onLike, onRemix, onReport, onAddComment, isFollowing, onToggleFollow }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const payload = generatePayload(post.template.type, post.template.inputs);
      QRCode.toCanvas(
        canvasRef.current,
        payload || 'https://qraft.design',
        {
          width: 150,
          margin: 2,
          color: {
            dark: post.template.style.fgColor,
            light: post.template.style.bgColor,
          },
          errorCorrectionLevel: post.template.style.ecl,
        },
        () => {}
      );
    }
  }, [post]);

  const handleShareLink = () => {
    const link = encodeTemplateToShareLink(post.template);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput);
    setCommentInput('');
  };

  return (
    <div
      className="p-6 rounded-3xl bg-paper-2/95 border border-paper-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden"
      style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
    >
      <Corner position="top-right" size={24} strokeColor="#13504D" fillColor="#F79454" />

      <div>
        {/* Post Header: Author Avatar & Name & Follow Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-heading font-bold text-xs shadow-sm"
              style={{ backgroundColor: post.author.avatarColor || '#13504D' }}
            >
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-heading font-bold text-peacock-deep">{post.author.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-saffron-50 text-peacock-deep border border-saffron-300">
                  Sample Template
                </span>
                <span className="text-[10px] text-ink/65 font-mono">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFollow(post.author.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold transition-colors cursor-pointer ${
              isFollowing
                ? 'bg-peacock/15 text-peacock-deep border border-peacock/30'
                : 'bg-paper text-ink/75 hover:text-peacock-deep border border-paper-border'
            }`}
          >
            {isFollowing ? <UserCheck className="w-3 h-3 text-peacock" /> : <UserPlus className="w-3 h-3" />}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>

        {/* QR Preview Canvas */}
        <div className="w-full flex items-center justify-center p-4 rounded-2xl bg-paper border border-paper-border mb-4 shadow-inner">
          <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
        </div>

        {/* Post Title & Description */}
        <h3 className="text-sm font-heading font-bold text-peacock-deep mb-1">{post.title}</h3>
        <p className="text-xs text-ink/75 leading-relaxed line-clamp-2 mb-3">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium bg-paper px-2 py-0.5 rounded-md text-ink/75 border border-paper-border">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactions Toolbar */}
      <div className="pt-3 border-t border-paper-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Like button */}
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                post.likedByMe
                  ? 'bg-vermilion-50 text-vermilion font-bold border border-vermilion/30'
                  : 'text-ink/75 hover:text-peacock-deep hover:bg-paper'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-current text-vermilion' : ''}`} />
              <span>{post.likesCount}</span>
            </button>

            {/* Remix button */}
            <button
              type="button"
              onClick={() => onRemix(post)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-heading font-bold text-peacock-deep hover:bg-paper transition-colors cursor-pointer border border-transparent hover:border-paper-border"
              title="Copy to your local templates with attribution"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Remix</span>
            </button>

            {/* Comments toggle */}
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-ink/75 hover:text-peacock-deep hover:bg-paper transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{post.comments.length}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Share Link */}
            <button
              type="button"
              onClick={handleShareLink}
              className="p-1.5 text-ink/75 hover:text-peacock-deep rounded-lg hover:bg-paper transition-colors cursor-pointer"
              title="Copy cross-device URL share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-peacock" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => onReport(post.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                post.reported
                  ? 'text-vermilion bg-vermilion-50'
                  : 'text-ink/65 hover:text-vermilion hover:bg-vermilion-50'
              }`}
              title="Report content"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Comment Thread Drawer */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-paper-border space-y-3">
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {post.comments.length === 0 ? (
                <p className="text-[11px] text-ink/65 italic">No notes yet. Add your review below.</p>
              ) : (
                post.comments.map((c) => (
                  <div key={c.id} className="text-xs bg-paper p-2.5 rounded-xl border border-paper-border">
                    <span className="font-heading font-bold text-peacock-deep mr-1.5">{c.authorName}:</span>
                    <span className="text-ink/80">{c.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-paper-border text-xs focus:outline-none focus:ring-2 focus:ring-peacock-deep bg-paper text-ink"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white text-xs font-heading font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export const CommunityTab: React.FC<CommunityTabProps> = ({ onRemixSuccess }) => {
  const { user, toggleFollow } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('likes');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadPosts = () => {
    setPosts(CommunityStore.getAll());
  };

  useEffect(() => {
    reloadPosts();
  }, []);

  const handleLike = (id: string) => {
    CommunityStore.toggleLike(id);
    reloadPosts();
  };

  const handleRemix = (post: CommunityPost) => {
    CommunityStore.remix(post, user?.id, user?.name);
    setToastMessage(`Remixed "${post.title}" to your templates!`);
    setTimeout(() => setToastMessage(null), 3000);
    if (onRemixSuccess) onRemixSuccess();
  };

  const handleReport = (id: string) => {
    if (window.confirm('Report this sample template for review?')) {
      CommunityStore.report(id);
      reloadPosts();
      alert('Thank you. This item has been marked for review.');
    }
  };

  const handleAddComment = (postId: string, text: string) => {
    CommunityStore.addComment(
      postId,
      user?.id || 'guest',
      user?.name || 'Guest Designer',
      text
    );
    reloadPosts();
  };

  const handleResetCommunity = () => {
    if (window.confirm('Reset community posts to seed data?')) {
      CommunityStore.resetCommunity();
      reloadPosts();
    }
  };

  const isUserFollowing = (authorId: string) => {
    return user?.following?.includes(authorId) || false;
  };

  // Filter & Sort
  const filtered = posts
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'likes') {
        return b.likesCount - a.likesCount;
      }
      return b.createdAt - a.createdAt;
    });

  return (
    <div className="w-full space-y-6">
      {/* Community Banner / Honest Architecture Note */}
      <div
        className="p-4 rounded-3xl bg-paper-2 border border-paper-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/80 relative overflow-hidden"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-peacock-deep flex-shrink-0" />
          <p>
            <strong>Template Gallery Notice:</strong> All cards shown below are curated <strong>sample templates</strong> designed with QRaft. To share a design cross-device, click <strong>"Share"</strong> to generate a URL hash that any browser can decode.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetCommunity}
          className="text-xs text-peacock-deep font-heading font-bold hover:underline whitespace-nowrap cursor-pointer"
        >
          Reset Samples
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-peacock/15 border border-peacock/30 text-peacock-deep text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2">
          <Lotus size={16} strokeColor="#13504D" fillColor="#F79454" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search and Sort Toolbar */}
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sample designs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-paper-border text-xs focus:outline-none focus:ring-2 focus:ring-peacock-deep bg-paper text-ink"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-bold text-peacock-deep flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </span>
          <button
            type="button"
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors cursor-pointer ${
              sortBy === 'likes'
                ? 'bg-peacock-deep text-white shadow-sm'
                : 'bg-paper text-ink/75 hover:text-peacock-deep border border-paper-border'
            }`}
          >
            Most Liked
          </button>
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-colors cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-peacock-deep text-white shadow-sm'
                : 'bg-paper text-ink/75 hover:text-peacock-deep border border-paper-border'
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {/* Grid of Community Cards */}
      {filtered.length === 0 ? (
        <EmptyStateScene
          motif="bird"
          title="No Designs Found"
          description="No sample templates matched your search keywords. Try searching for 'wifi', 'badge', or clear the filter."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onRemix={handleRemix}
              onReport={handleReport}
              onAddComment={handleAddComment}
              isFollowing={isUserFollowing(post.author.id)}
              onToggleFollow={toggleFollow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
