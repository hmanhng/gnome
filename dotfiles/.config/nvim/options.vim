" => General Settings {{{
set nocompatible                " be iMproved, required
filetype off                    " required

filetype plugin indent on    " required
syntax on
set termguicolors t_Co=256                    " Set if term supports 256 colors.
set expandtab                   " Use spaces instead of tabs.
set shiftwidth=4                " One tab == four spaces.
set tabstop=4                   " One tab == four spaces.
set list listchars=tab:>-,trail:~,extends:>,precedes:<

set foldmethod=indent
set foldnestmax=10
set foldlevel=2

set path+=**                    " Searches current directory recursively.

set ignorecase smartcase        " Ignore search case

set noshowmode                  " Uncomment to prevent non-normal modes showing in powerline and below powerline.
set nobackup nowritebackup
set noswapfile                  " No swap

set confirm

set linebreak
set cursorline
set number relativenumber        " Display line numbers
set clipboard+=unnamedplus       " Copy/paste between vim and other programs.
set laststatus=2                 " Always show statusline

" Mouse Scrolling
set mouse=a

" Map seach in center line
set scrolloff=999
nnoremap n nzz
nnoremap N Nzz

" Splits and Tabbed Files
set splitbelow splitright
" delays and poor user experience.
set updatetime=750
" Don't pass messages to |ins-completion-menu|.
set shortmess+=c

set fillchars+=vert:\           " Removes pipes
autocmd VimEnter * :silent exec "!kill -s SIGWINCH $PPID"     
"}}}