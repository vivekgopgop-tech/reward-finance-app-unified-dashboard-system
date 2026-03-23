import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2025. Built with{' '}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
