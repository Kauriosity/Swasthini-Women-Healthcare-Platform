'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { MessageCircle, ThumbsUp, UserCircle2 } from 'lucide-react';

export default function ForumPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [commentInput, setCommentInput] = useState<{ [key: number]: string }>({});

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/forum');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/forum', { title, content, isAnonymous });
      setTitle(''); setContent(''); setIsAnonymous(false);
      fetchPosts();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  const handleAddComment = async (postId: number) => {
    try {
      if (!commentInput[postId]) return;
      await axiosInstance.post(`/forum/${postId}/comments`, { content: commentInput[postId] });
      setCommentInput({ ...commentInput, [postId]: '' });
      fetchPosts();
    } catch (err) {
      alert('Failed to add comment');
    }
  };

  const handleVote = async (postId: number, type: 'UPVOTE' | 'DOWNVOTE') => {
    try {
      await axiosInstance.post(`/forum/${postId}/vote`, { type });
      fetchPosts();
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Community Support</h1>
        <p className="text-foreground/70">A safe space to ask questions, share experiences, and support each other.</p>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Start a Discussion</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input label="Title" value={title} onChange={(e: any) => setTitle(e.target.value)} required placeholder="What's on your mind?" />
          <div className="flex flex-col gap-1">
            <textarea 
              className="w-full px-4 py-2 border border-accent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
              placeholder="Share your experience or ask a question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anon" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-4 h-4 text-primary rounded focus:ring-primary"/>
            <label htmlFor="anon" className="text-sm text-foreground/80">Post anonymously</label>
          </div>
          <Button type="submit">Post to Community</Button>
        </form>
      </Card>

      <div className="space-y-6">
        {loading ? <p>Loading discussions...</p> : posts.length === 0 ? <p className="text-center text-foreground/50 py-8">No posts yet. Be the first to start a conversation!</p> : (
          posts.map(post => (
            <Card key={post.id} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCircle2 className="w-8 h-8 text-secondary fill-primary/20" />
                <div>
                  <p className="font-bold text-sm text-foreground">{post.isAnonymous ? 'Anonymous' : (post.user?.name || 'User')}</p>
                  <p className="text-xs text-foreground/50">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-foreground/80">{post.content}</p>
              
              <div className="flex items-center gap-4 pt-2 border-t border-secondary mt-4">
                <button onClick={() => handleVote(post.id, 'UPVOTE')} className="flex items-center gap-1 text-sm text-foreground/60 hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" /> {post.votes?.filter((v: any) => v.type === 'UPVOTE').length || 0}
                </button>
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                   <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0}
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-secondary/20 p-4 rounded-xl space-y-3 mt-4">
                {post.comments && post.comments.map((comment: any) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-bold text-foreground">{comment.user?.name || 'User'}: </span>
                    <span className="text-foreground/80">{comment.content}</span>
                  </div>
                ))}
                
                <div className="flex gap-2 mt-2">
                  <input 
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[post.id] || ''}
                    onChange={(e) => setCommentInput({...commentInput, [post.id]: e.target.value})}
                    className="flex-1 px-3 py-1 text-sm border border-accent rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button onClick={() => handleAddComment(post.id)} className="px-3 py-1 text-sm">Reply</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
