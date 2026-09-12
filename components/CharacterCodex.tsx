'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import { useLumi, LumiPresenter } from './lumi';
import { Button } from './ui/Button';
import { LumiMascot } from './LumiMascot';
import {
  IconAttributeIntellect,
  IconAttributeStrength,
  IconAttributeAgility,
  IconAttributeVitality,
  IconAttributeSpirit,
  IconSparkles,
  IconChest,
  IconHeart,
  IconXpGem,
  IconGoldCoin,
} from './icons/LumiIcons';

export const CharacterCodex: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const lumi = useLumi();
  const [inventory, setInventory] = useState<any[]>([]);
  const [equippingId, setEquippingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.inventory) {
        setInventory(data.inventory);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleToggleEquip = async (inventoryId: string) => {
    if (equippingId) return;
    setEquippingId(inventoryId);
    sound.playClick();

    try {
      const res = await fetch('/api/inventory/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventoryId }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playQuestComplete();
        lumi.react('SHOP_TRY_ON', 'Equipment adjusted! Looking magnificent.');
        await refreshUser();
        await fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEquippingId(null);
    }
  };

  if (!user) return null;

  const stats = user.stats || {
    strength: 5,
    intellect: 5,
    agility: 5,
    vitality: 5,
    spirit: 5,
  };

  // Monochromatic primary tokens: every attribute uses custom 24x24 icon and brand amethyst
  const statList = [
    { key: 'intellect', label: 'Intellect (INT)', val: stats.intellect, icon: IconAttributeIntellect },
    { key: 'strength', label: 'Strength (STR)', val: stats.strength, icon: IconAttributeStrength },
    { key: 'agility', label: 'Agility (AGI)', val: stats.agility, icon: IconAttributeAgility },
    { key: 'vitality', label: 'Vitality (VIT)', val: stats.vitality, icon: IconAttributeVitality },
    { key: 'spirit', label: 'Spirit (SPI)', val: stats.spirit, icon: IconAttributeSpirit },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Character Identity */}
      <div className="bg-surface rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-lavender-soft to-surface border-2 border-primary/30 flex items-center justify-center p-0.5 shadow-xs overflow-hidden shrink-0">
            <LumiPresenter variant="mini" height={76} showSpeech={false} interactive={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-copy">{user.username}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-[#1F1730] text-xs font-black">
                Lv. {user.level}
              </span>
            </div>
            <p className="text-xs font-bold text-primary mt-0.5">{user.title}</p>
            <p className="text-xs text-copy-muted mt-1">
              Adventurer registered at the Guild · {user.streak} day streak
            </p>
          </div>
        </div>

        {/* Vital Gauges */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-background border border-slate-200 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-bold flex items-center justify-center gap-1">
              <IconHeart size={14} filled className="text-danger" />
              <span>Health</span>
            </span>
            <span className="text-sm font-black text-danger mt-0.5 block">
              {user.hp} / {user.maxHp} HP
            </span>
          </div>
          <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-background border border-slate-200 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-bold flex items-center justify-center gap-1">
              <IconXpGem size={14} filled className="text-primary" />
              <span>Experience</span>
            </span>
            <span className="text-sm font-black text-primary mt-0.5 block">
              {user.xp} / {user.xpNeeded} XP
            </span>
          </div>
          <div className="flex-1 md:flex-initial p-3 rounded-2xl bg-background border border-slate-200 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-bold flex items-center justify-center gap-1">
              <IconGoldCoin size={14} filled className="text-accent" />
              <span>Vault Gold</span>
            </span>
            <span className="text-sm font-black text-accent mt-0.5 block">
              {user.gold} GP
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Attributes Breakdown */}
        <div className="bg-surface rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-copy flex items-center gap-2">
              <IconSparkles size={16} className="text-primary" />
              <span>Core Character Attributes</span>
            </h3>
            <span className="text-xs text-copy-muted font-semibold">Trained by Quests</span>
          </div>

          <div className="flex flex-col gap-4">
            {statList.map((st) => {
              const Icon = st.icon;
              const maxScale = Math.max(25, st.val + 10);
              const percent = Math.min(100, Math.round((st.val / maxScale) * 100));

              return (
                <div key={st.key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-copy">
                      <Icon size={16} className="text-primary" />
                      <span>{st.label}</span>
                    </div>
                    <span className="font-black text-copy">{st.val} pts</span>
                  </div>
                  {/* Monochromatic Primary Bar */}
                  <div
                    className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200"
                    role="progressbar"
                    aria-valuenow={st.val}
                    aria-valuemin={0}
                    aria-valuemax={maxScale}
                    aria-label={`${st.label}: ${st.val} points`}
                  >
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Equipment Paper Doll & Inventory */}
        <div className="bg-surface rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-copy flex items-center gap-2">
              <IconChest size={16} filled className="text-primary" />
              <span>Equipped Gear & Adventurer's Pack</span>
            </h3>
            <span className="text-xs text-copy-muted font-semibold">
              {inventory.length} items
            </span>
          </div>

          {/* 3D Companion Pedestal Showcase */}
          <div className="w-full rounded-2xl bg-gradient-to-b from-lavender-soft/40 to-surface border border-primary/20 p-2 overflow-hidden flex flex-col items-center justify-center">
            <LumiPresenter variant="pedestal" height={170} interactive />
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mt-1">
              Companion Paper Doll · Interactive 3D
            </span>
          </div>

          {inventory.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <IconChest size={36} className="text-copy-muted/40 mb-2" />
              <p className="text-xs text-copy-muted max-w-xs">
                Your inventory is empty. Visit the Guild Emporium to purchase gear and companion accessories!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {inventory.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                    inv.isEquipped
                      ? 'bg-lavender-soft/30 border-primary shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-copy truncate">{inv.item.name}</h5>
                      {inv.isEquipped && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary text-[#1F1730]">
                          EQUIPPED
                        </span>
                      )}
                      {inv.quantity > 1 && (
                        <span className="text-[10px] text-copy-muted font-bold">
                          x{inv.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-copy-muted line-clamp-1 mt-0.5">
                      {inv.item.description}
                    </p>
                  </div>

                  <Button
                    variant={inv.item.category === 'CONSUMABLE' ? 'accent' : inv.isEquipped ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={equippingId === inv.id}
                    isLoading={equippingId === inv.id}
                    onClick={() => handleToggleEquip(inv.id)}
                  >
                    {inv.item.category === 'CONSUMABLE'
                      ? 'Use'
                      : inv.isEquipped
                      ? 'Unequip'
                      : 'Equip'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
