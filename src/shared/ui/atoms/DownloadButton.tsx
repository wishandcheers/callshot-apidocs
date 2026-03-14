import { Download } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib/cn';

interface DownloadButtonProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'download'> {
  href: string;
  fileName: string;
}

export function DownloadButton({
  href,
  fileName,
  className,
  ...props
}: DownloadButtonProps) {
  return (
    <a
      href={href}
      download={fileName}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
      {...props}
    >
      <Download className="size-4" aria-hidden="true" />
    </a>
  );
}
