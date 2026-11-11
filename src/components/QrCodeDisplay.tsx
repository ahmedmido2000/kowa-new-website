'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { isSafeHref } from '@/lib/cms-helpers';

interface QrCodeDisplayProps {
  qrImageUrl?: string | null;
  qrTargetUrl?: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export function QrCodeDisplay({
  qrImageUrl,
  qrTargetUrl,
  alt,
  size = 112,
  className = '',
}: QrCodeDisplayProps) {
  const [generatedEntry, setGeneratedEntry] = useState<{
    target: string;
    dataUrl: string;
  } | null>(null);

  const safeImageUrl = qrImageUrl && isSafeHref(qrImageUrl) ? qrImageUrl.trim() : '';
  const safeTargetUrl = qrTargetUrl && isSafeHref(qrTargetUrl) ? qrTargetUrl.trim() : '';

  useEffect(() => {
    if (safeImageUrl || !safeTargetUrl) {
      return;
    }

    let active = true;
    QRCode.toDataURL(safeTargetUrl, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#140959',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) setGeneratedEntry({ target: safeTargetUrl, dataUrl: url });
      })
      .catch(() => {
        // Keep unavailable
      });

    return () => {
      active = false;
    };
  }, [safeImageUrl, safeTargetUrl, size]);

  const src =
    safeImageUrl || (generatedEntry?.target === safeTargetUrl ? generatedEntry.dataUrl : '');

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`object-contain rounded-lg ${className}`}
    />
  );
}
