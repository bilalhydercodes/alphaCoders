'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { useLumi } from './lumi';
import { Button } from './ui/Button';
import {
  IconGoldCoin,
  IconEmporium,
  IconSparkles,
  IconClose,
} from './icons/LumiIcons';

export const GuildEmporium: React.FC = () => {
  const { user, refreshUser, updateUserOptimistic, triggerLumiReaction } = useAuth();
  const lumi = useLumi();
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
      lumi.react('YOU_GOT_THIS', 'A few more quests and you can afford this!');
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
        lumi.react('SHOP_TRY_ON', `Lumi is thrilled with the new ${item.name}!`, item.cost);
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
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lavender-soft border-2 border-primary/20 flex items-center justify-center text-primary shrink-0">
            <IconEmporium size={24} filled />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-copy">The Guild Emporium</h2>
            <p className="text-xs text-copy-muted mt-0.5">
              Spend hard-earned Bounty Gold on adventurer gear, consumables, and Lumi accessories.
            </p>
          </div>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent text-[#1F1730] font-black text-sm shadow-xs shrink-0">
          <IconGoldCoin size={18} filled />
          <span>{user.gold} GP Available</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-success-soft border-success/30 text-[#1B6E32]'
              : 'bg-danger-soft border-danger/30 text-danger'
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="p-1 text-current hover:opacity-75 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Dismiss message"
          >
            <IconClose size={16} />
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
              className="bg-surface rounded-2xl border-2 border-slate-200 p-5 shadow-xs hover:border-primary/40 transition-all duration-200 flex flex-col justify-between gap-4"
            >
              <div>
                {/* Top Badge & Cost */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-lavender-soft text-[#492673] border border-primary/20 uppercase tracking-wide">
                    {item.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 font-black text-xs text-[#875800]">
                    <IconGoldCoin size={14} filled className="text-accent" />
                    <span>{item.cost} GP</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-copy">{item.name}</h4>
                <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                  {item.description}
                </p>

                {/* Stat Modifiers */}
                {item.statModifier && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-background border border-primary/15 text-[11px] font-bold text-primary">
                    <IconSparkles size={12} className="text-primary" />
                    <span>Buff: {item.statModifier.replace(/[{"}]/g, '').replace(':', ': +')}</span>
                  </div>
                )}
              </div>

              {/* Purchase Button using shared Button component */}
              <Button
                variant={canAfford ? 'primary' : 'secondary'}
                size="sm"
                fullWidth
                disabled={!canAfford || isBuying}
                isLoading={isBuying}
                onClick={() => handleBuy(item)}
                leftIcon={<IconGoldCoin size={14} filled className={canAfford ? 'text-[#1F1730]' : 'text-accent'} />}
              >
                {canAfford ? 'Buy Item' : 'Need More GP'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
