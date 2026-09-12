'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';
import {
  Sparkles,
  BookOpen,
  Dumbbell,
  Zap,
  Heart,
  Shield,
  Award,
  Flame,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const CharacterCodex: React.FC = () => {
  const { user, refreshUser } = useAuth();
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

  const statList = [
    { key: 'intellect', label: 'Intellect (INT)', val: stats.intellect, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-500' },
    { key: 'strength', label: 'Strength (STR)', val: stats.strength, icon: Dumbbell, color: 'text-red-600', bg: 'bg-red-500' },
    { key: 'agility', label: 'Agility (AGI)', val: stats.agility, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500' },
    { key: 'vitality', label: 'Vitality (VIT)', val: stats.vitality, icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-500' },
    { key: 'spirit', label: 'Spirit (SPI)', val: stats.spirit, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Character Identity */}
      <div className="bg-white rounded-lumi border border-primary/15 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-lavender-soft to-white border-2 border-primary/30 flex items-center justify-center p-2 shadow-sm overflow-hidden flex-shrink-0">
            <img
              src="/lumi/extracted/lumi-avatar.png"
              alt="Character portrait with companion"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/lumi/extracted/lumi-hero.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-copy">{user.username}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-on text-xs font-extrabold">
                Lv. {user.level}
              </span>
            </div>
            <p className="text-xs font-semibold text-primary mt-0.5">{user.title}</p>
            <p className="text-xs text-copy-muted mt-1">
              Adventurer registered at the Guild · {user.streak} day streak
            </p>
          </div>
        </div>

        {/* Vital Gauges */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial p-3 rounded-xl bg-background border border-primary/15 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-semibold block">Health Points</span>
            <span className="text-sm font-extrabold text-danger mt-0.5 block">
              {user.hp} / {user.maxHp} HP
            </span>
          </div>
          <div className="flex-1 md:flex-initial p-3 rounded-xl bg-background border border-primary/15 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-semibold block">Experience</span>
            <span className="text-sm font-extrabold text-primary mt-0.5 block">
              {user.xp} / {user.xpNeeded} XP
            </span>
          </div>
          <div className="flex-1 md:flex-initial p-3 rounded-xl bg-background border border-primary/15 text-center min-w-[100px]">
            <span className="text-[11px] text-copy-muted font-semibold block">Vault Gold</span>
            <span className="text-sm font-extrabold text-accent mt-0.5 block">
              {user.gold} GP
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Attributes Breakdown */}
        <div className="bg-white rounded-lumi border border-primary/15 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h3 className="text-sm font-bold text-copy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Core Character Attributes</span>
            </h3>
            <span className="text-xs text-copy-muted font-medium">Trained by Quests</span>
          </div>

          <div className="flex flex-col gap-4">
            {statList.map((st) => {
              const Icon = st.icon;
              const maxScale = Math.max(25, st.val + 10);
              const percent = Math.min(100, Math.round((st.val / maxScale) * 100));

              return (
                <div key={st.key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-copy">
                      <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                      <span>{st.label}</span>
                    </div>
                    <span className="font-extrabold text-copy">{st.val} pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-lavender-soft overflow-hidden border border-primary/15">
                    <div
                      className={`h-full ${st.bg} rounded-full transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Equipment Paper Doll & Inventory */}
        <div className="bg-white rounded-lumi border border-primary/15 p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h3 className="text-sm font-bold text-copy flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span>Equipped Gear & Adventurer's Pack</span>
            </h3>
            <span className="text-xs text-copy-muted font-medium">
              {inventory.length} items
            </span>
          </div>

          {inventory.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Package className="w-8 h-8 text-copy-muted/40 mb-2" />
              <p className="text-xs text-copy-muted">
                Your inventory is empty. Visit the Guild Emporium to purchase gear and companion accessories!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {inventory.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    inv.isEquipped
                      ? 'bg-lavender-soft/40 border-primary shadow-sm'
                      : 'border-gray-200 hover:border-primary/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-copy">{inv.item.name}</h5>
                      {inv.isEquipped && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-primary text-primary-on">
                          EQUIPPED
                        </span>
                      )}
                      {inv.quantity > 1 && (
                        <span className="text-[10px] text-copy-muted font-semibold">
                          x{inv.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-copy-muted line-clamp-1 mt-0.5">
                      {inv.item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleEquip(inv.id)}
                    disabled={equippingId === inv.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inv.item.category === 'CONSUMABLE'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : inv.isEquipped
                        ? 'bg-white border border-primary/30 text-primary hover:bg-rose-50 hover:text-danger hover:border-danger'
                        : 'bg-primary text-primary-on hover:bg-primary-hover'
                    }`}
                  >
                    {inv.item.category === 'CONSUMABLE'
                      ? 'Drink / Use'
                      : inv.isEquipped
                      ? 'Unequip'
                      : 'Equip'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
