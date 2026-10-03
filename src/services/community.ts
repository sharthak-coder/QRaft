import { CommunityPost, CommunityComment, Template } from '../types';
import { SEED_COMMUNITY_POSTS } from './seed';
import { TemplateStore } from './templates';

const COMMUNITY_KEY = 'qraft:community:v1';

export class CommunityStore {
  public static getAll(): CommunityPost[] {
    try {
      const data = localStorage.getItem(COMMUNITY_KEY);
      if (!data) {
        this.saveAll(SEED_COMMUNITY_POSTS);
        return SEED_COMMUNITY_POSTS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return SEED_COMMUNITY_POSTS;
      return parsed;
    } catch {
      return SEED_COMMUNITY_POSTS;
    }
  }

  public static saveAll(posts: CommunityPost[]): void {
    try {
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Failed to save community posts', err);
    }
  }

  public static publish(
    template: Template,
    title: string,
    description: string,
    tags: string[],
    author: { id: string; name: string; avatarColor?: string }
  ): CommunityPost {
    const all = this.getAll();
    const newPost: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      templateId: template.id,
      title: title.trim().slice(0, 80),
      description: description.trim().slice(0, 300),
      tags: tags.map(t => t.trim().toLowerCase().slice(0, 20)).filter(Boolean),
      template: { ...template },
      author: {
        id: author.id,
        name: author.name,
        avatarColor: author.avatarColor || '#1A56DB',
      },
      likesCount: 0,
      likedByMe: false,
      comments: [],
      createdAt: Date.now(),
      reported: false,
    };

    all.unshift(newPost);
    this.saveAll(all);
    return newPost;
  }

  public static toggleLike(postId: string): CommunityPost | null {
    const all = this.getAll();
    const post = all.find(p => p.id === postId);
    if (!post) return null;

    if (post.likedByMe) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.likedByMe = false;
    } else {
      post.likesCount += 1;
      post.likedByMe = true;
    }

    this.saveAll(all);
    return post;
  }

  public static addComment(
    postId: string,
    authorId: string,
    authorName: string,
    text: string
  ): CommunityComment | null {
    const cleanText = text.trim();
    if (!cleanText) return null;

    const all = this.getAll();
    const post = all.find(p => p.id === postId);
    if (!post) return null;

    const comment: CommunityComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      authorId,
      authorName,
      text: cleanText.slice(0, 300),
      createdAt: Date.now(),
    };

    post.comments.push(comment);
    this.saveAll(all);
    return comment;
  }

  public static report(postId: string): boolean {
    const all = this.getAll();
    const post = all.find(p => p.id === postId);
    if (!post) return false;

    post.reported = true;
    this.saveAll(all);
    return true;
  }

  public static remix(post: CommunityPost, currentUserId?: string, currentUserName?: string): Template {
    return TemplateStore.create(
      {
        name: `Remix: ${post.template.name}`,
        type: post.template.type,
        inputs: post.template.inputs,
        style: post.template.style,
        threeSettings: post.template.threeSettings,
        tags: [...post.template.tags, 'remix'],
        originalAuthor: post.author.name,
      },
      currentUserId,
      currentUserName
    );
  }

  public static resetCommunity(): void {
    this.saveAll(SEED_COMMUNITY_POSTS);
  }
}
