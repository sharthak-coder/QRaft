import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CommunityPost } from '../../types';
import { CommunityStore } from '../../services/community';
import { encodeTemplateToShareLink } from '../../lib/shareLink';
import { generatePayload } from '../../lib/payload';
import { useAuth } from '../../hooks/useAuth';
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
    <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-surface-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
      <div>
        {/* Post Header: Author Avatar & Name & Follow Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
              style={{ backgroundColor: post.author.avatarColor }}
            >
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-surface-text">{post.author.name}</p>
              <p className="text-[10px] text-surface-muted">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleFollow(post.author.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
              isFollowing
                ? 'bg-emerald-50 text-google-green border border-emerald-200'
                : 'bg-surface-soft text-surface-muted hover:text-surface-text border border-surface-border'
            }`}
          >
            {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>

        {/* QR Preview Canvas */}
        <div className="w-full flex items-center justify-center p-4 rounded-2xl bg-surface-soft border border-surface-border mb-4">
          <canvas ref={canvasRef} className="rounded-xl shadow-sm" />
        </div>

        {/* Post Title & Description */}
        <h3 className="text-sm font-bold text-surface-text mb-1">{post.title}</h3>
        <p className="text-xs text-surface-muted leading-relaxed line-clamp-2 mb-3">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium bg-surface-soft px-2 py-0.5 rounded-md text-surface-muted">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactions Toolbar */}
      <div className="pt-3 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Like button */}
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                post.likedByMe
                  ? 'bg-red-50 text-google-red font-bold'
                  : 'text-surface-muted hover:text-surface-text hover:bg-surface-soft'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${post.likedByMe ? 'fill-current' : ''}`} />
              <span>{post.likesCount}</span>
            </button>

            {/* Remix button */}
            <button
              type="button"
              onClick={() => onRemix(post)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-surface-muted hover:text-google-blue-royal hover:bg-blue-50 transition-colors"
              title="Copy to your templates with attribution"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Remix</span>
            </button>

            {/* Comments toggle */}
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-surface-muted hover:text-surface-text hover:bg-surface-soft transition-colors"
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
              className="p-1.5 text-surface-muted hover:text-google-blue-royal rounded-lg hover:bg-blue-50 transition-colors"
              title="Copy cross-device URL share link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-google-green" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Report */}
            <button
              type="button"
              onClick={() => onReport(post.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                post.reported
                  ? 'text-google-red bg-red-50'
                  : 'text-surface-muted hover:text-google-red hover:bg-red-50'
              }`}
              title="Report content"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Comment Thread Drawer */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-surface-border space-y-3">
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {post.comments.length === 0 ? (
                <p className="text-[11px] text-surface-muted italic">No comments yet. Be the first to chime in!</p>
              ) : (
                post.comments.map((c) => (
                  <div key={c.id} className="text-xs bg-surface-soft p-2.5 rounded-xl border border-surface-border/60">
                    <span className="font-bold text-surface-text mr-1.5">{c.authorName}:</span>
                    <span className="text-surface-muted">{c.text}</span>
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
                className="flex-1 px-3 py-1.5 rounded-xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-google-blue bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-google-blue-royal text-white text-xs font-semibold hover:bg-google-blue-deep transition-colors"
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
    if (window.confirm('Report this post for moderation review?')) {
      CommunityStore.report(id);
      reloadPosts();
      alert('Thank you. This post has been marked for moderation.');
    }
  };

  const handleAddComment = (postId: string, text: string) => {
    CommunityStore.addComment(
      postId,
      user?.id || 'guest',
      user?.name || 'Guest User',
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
      {/* Community Banner / Honest Limitation Note */}
      <div className="p-4 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-google-blue-royal flex-shrink-0" />
          <p>
            <strong>Decentralized Sharing Architecture:</strong> The community feed is local to this browser session. To share a design with other devices, use the <strong>"Copy Share Link"</strong> button, which encodes the template into the URL hash.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetCommunity}
          className="text-xs text-google-blue-royal font-bold hover:underline whitespace-nowrap"
        >
          Reset Seed Data
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-google-green text-xs font-bold rounded-2xl text-center animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Search and Sort Toolbar */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search community designs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-google-blue bg-surface-soft"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-surface-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sort:
          </span>
          <button
            type="button"
            onClick={() => setSortBy('likes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sortBy === 'likes'
                ? 'bg-google-blue-royal text-white'
                : 'bg-surface-soft text-surface-muted hover:text-surface-text'
            }`}
          >
            Most Liked
          </button>
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sortBy === 'newest'
                ? 'bg-google-blue-royal text-white'
                : 'bg-surface-soft text-surface-muted hover:text-surface-text'
            }`}
          >
            Newest
          </button>
        </div>
      </div>

      {/* Grid of Community Cards */}
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
    </div>
  );
};
