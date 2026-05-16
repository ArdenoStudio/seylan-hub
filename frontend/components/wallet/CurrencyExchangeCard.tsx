"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, ArrowRightLeft, ChevronDown } from "lucide-react";
import { REMITTANCE_CURRENCIES, type RemittanceCurrency } from "@/lib/remittance-fx";

const LKR: RemittanceCurrency = {
  code: "LKR",
  name: "Sri Lankan Rupee",
  flag: "🇱🇰",
  lkrRate: 1,
  symbol: "Rs",
};

interface CurrencyExchangeCardProps {
  initialFromCurrency: RemittanceCurrency;
  availableBalance?: number;
  taxRate?: number;
  feeRate?: number;
  onExchange: (data: {
    from: RemittanceCurrency;
    amount: number;
    amountLkr: number;
  }) => void;
  className?: string;
}

function CurrencySelector({
  selected,
  onChange,
  options,
  disabled,
}: {
  selected: RemittanceCurrency;
  onChange: (c: RemittanceCurrency) => void;
  options: RemittanceCurrency[];
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 text-sm font-semibold text-gray-700">
        <span className="text-base">{selected.flag}</span>
        <span>{selected.code}</span>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-gray-700",
        "hover:bg-gray-100 focus:outline-none transition-colors"
      )}>
        <span className="text-base">{selected.flag}</span>
        <span>{selected.code}</span>
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {options.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => onChange(c)}
            className={cn(
              "flex items-center gap-3",
              selected.code === c.code && "font-semibold text-[#E31821]"
            )}
          >
            <span className="text-base">{c.flag}</span>
            <span className="font-mono text-xs font-bold">{c.code}</span>
            <span className="text-xs text-gray-500">{c.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CurrencyExchangeCard({
  initialFromCurrency,
  availableBalance,
  taxRate = 0,
  feeRate = 0,
  onExchange,
  className,
}: CurrencyExchangeCardProps) {
  const [amount, setAmount] = useState("100.00");
  const [fromCurrency, setFromCurrency] = useState<RemittanceCurrency>(initialFromCurrency);
  const [animationKey, setAnimationKey] = useState(0);

  const numericAmount = parseFloat(amount) || 0;

  const { tax, fee, amountLkr } = useMemo(() => {
    const calculatedTax = numericAmount * taxRate;
    const calculatedFee = numericAmount * feeRate;
    const net = numericAmount - calculatedTax - calculatedFee;
    return {
      tax: calculatedTax,
      fee: calculatedFee,
      amountLkr: net > 0 ? Math.round(net * fromCurrency.lkrRate) : 0,
    };
  }, [numericAmount, taxRate, feeRate, fromCurrency]);

  function handleSwap() {
    setAnimationKey((k) => k + 1);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
  }

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-500">
          <RefreshCw className="h-3.5 w-3.5" />
          FX Calculator
        </p>
      </div>

      {/* Currency pair row */}
      <div className="relative flex items-center justify-between rounded-lg border border-gray-200 bg-white px-2 py-1.5">
        <motion.div
          key={`${animationKey}-from`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <CurrencySelector
            selected={fromCurrency}
            onChange={(c) => {
              setAnimationKey((k) => k + 1);
              setTimeout(() => setFromCurrency(c), 120);
            }}
            options={REMITTANCE_CURRENCIES}
          />
        </motion.div>

        <button
          type="button"
          onClick={handleSwap}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-700 transition-colors"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
        </button>

        <motion.div
          key={`${animationKey}-to`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <CurrencySelector selected={LKR} onChange={() => {}} options={[LKR]} disabled />
        </motion.div>
      </div>

      {/* Amount input */}
      <div className="relative text-center">
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-gray-200 select-none">
          {fromCurrency.code}
        </span>
        <Input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="h-auto border-none bg-transparent p-0 text-center text-5xl font-bold tracking-tighter shadow-none focus-visible:ring-0 text-gray-900"
          placeholder="0.00"
        />
        {availableBalance !== undefined && (
          <p className="mt-1 text-xs text-gray-400">
            Available:{" "}
            <span className="font-semibold text-gray-600">
              {fromCurrency.symbol}{availableBalance.toLocaleString()}
            </span>
          </p>
        )}
      </div>

      {/* Rate pill */}
      <div className="rounded-lg bg-white border border-gray-100 px-3 py-2 text-center text-xs text-gray-500">
        1 {fromCurrency.code} = <span className="font-semibold text-gray-800">{fromCurrency.lkrRate}</span> LKR
      </div>

      {/* Fee breakdown */}
      {(taxRate > 0 || feeRate > 0) && (
        <div className="space-y-1.5 text-xs">
          {taxRate > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Tax ({taxRate * 100}%)</span>
              <span>{fromCurrency.symbol}{tax.toFixed(2)}</span>
            </div>
          )}
          {feeRate > 0 && (
            <div className="flex justify-between text-gray-500">
              <span>Exchange fee ({feeRate * 100}%)</span>
              <span>{fromCurrency.symbol}{fee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold text-gray-800">
            <span>Total in LKR</span>
            <span>Rs {amountLkr.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* No fees — just show total */}
      {taxRate === 0 && feeRate === 0 && (
        <div className="flex justify-between text-xs font-semibold text-gray-800">
          <span>Total in LKR</span>
          <span>Rs {amountLkr.toLocaleString()}</span>
        </div>
      )}

      {/* Action */}
      <Button
        size="sm"
        className="w-full bg-[#E31821] text-white hover:bg-[#c41219]"
        onClick={() => onExchange({ from: fromCurrency, amount: numericAmount, amountLkr })}
      >
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Use this amount
      </Button>
    </div>
  );
}
