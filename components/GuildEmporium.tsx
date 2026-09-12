'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { Coins, Sparkles, ShoppingBag, Shield, Heart, Zap, Check } from 'lucide-react';

export const GuildEmporium: React.FC = () => {
  const { user, refreshUser, updateUserOptimistic, triggerLumiReaction } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/shop/items');
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleBuy = async (item: any) => {
    if (!user || buyingId) return;
    if (user.gold < item.cost) {
      sound.playClick();
      setMessage({
        text: `Insufficient Gold! You need ${item.cost} GP but have ${user.gold} GP. Complete more bounties!`,
        type: 'error',
      });
      triggerLumiReaction('yougotthis', 'A few more quests and you can afford this!');
      return;
    }

    setBuyingId(item.id);
    sound.playCoin();

    // Optimistic gold update
    updateUserOptimistic((prev) => ({
      ...prev,
      gold: prev.gold - item.cost,
    }));

    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();

      if (data.success) {
        sound.playQuestComplete();
        setMessage({ text: `Acquired ${item.name}! Check your Character Codex.`, type: 'success' });
        triggerLumiReaction('explore', `Lumi loves the new ${item.name}!`);
        await refreshUser();
        await fetchItems();
      } else {
        setMessage({ text: data.error || 'Failed to complete purchase', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Network communication failure', type: 'error' });
    } finally {
      setBuyingId(null);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white rounded-lumi border border-primary/15 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-accent flex-shrink-0">
            <ShoppingBag className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-copy">The Guild Emporium</h2>
            <p className="text-xs text-copy-muted mt-0.5">
              Spend your hard-earned Bounty Gold on adventurer gear, consumables, and Lumi accessories.
            </p>
          </div>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-primary-on font-extrabold text-sm shadow-sm">
          <Coins className="w-4 h-4" />
          <span>{user.gold} GP Available</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-success-soft border-success/30 text-success'
              : 'bg-danger-soft border-danger/30 text-danger'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-[11px] underline font-bold ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const canAfford = user.gold >= item.cost;
          const isBuying = buyingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-lumi border border-primary/15 p-5 shadow-lumi-card hover:shadow-lumi hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div>
                {/* Top Badge & Cost */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-lavender-soft text-primary uppercase tracking-wide">
                    {item.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 font-extrabold text-xs text-accent">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{item.cost} GP</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-copy">{item.name}</h4>
                <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                  {item.description}
                </p>

                {/* Stat Modifiers */}
                {item.statModifier && (
                  <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border border-primary/15 text-[11px] font-semibold text-primary">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>Buff: {item.statModifier.replace(/[{"}]/g, '').replace(':', ': +')}</span>
                  </div>
                )}
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handleBuy(item)}
                disabled={isBuying}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  canAfford
                    ? 'bg-primary text-primary-on hover:bg-primary-hover active:scale-97'
                    : 'bg-gray-100 text-copy-muted border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{isBuying ? 'Purchasing...' : canAfford ? 'Buy Item' : 'Need More GP'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
