'use client';

import { useState } from 'react';
import Image from 'next/image';

export function DirectorPortrait() {
  const [imgSrc, setImgSrc] = useState('/assets/img/team/director-anil-dhariwal.webp');

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-slate-200">
      <Image
        src={imgSrc}
        alt="Director Anil Dhariwal"
        fill
        sizes="280px"
        className="object-cover object-top"
        onError={() => setImgSrc('https://via.placeholder.com/300x340?text=Director+Anil+Dhariwal')}
      />
    </div>
  );
}
