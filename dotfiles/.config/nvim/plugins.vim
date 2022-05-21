" Automatically install vim-plug
autocmd VimEnter *
  \  if len(filter(values(g:plugs), '!isdirectory(v:val.dir)'))
  \|   PlugInstall --sync | q
  \| endif

call plug#begin('~/.nvim/plugged')
    Plug 'navarasu/onedark.nvim'
    Plug 'sainnhe/gruvbox-material'
    Plug 'neoclide/coc.nvim', {'branch': 'release'}
    Plug 'voldikss/vim-floaterm'
    Plug 'junegunn/fzf', { 'do': { -> fzf#install() } } 		" Fuzzy finder
    Plug 'junegunn/fzf.vim'
    Plug 'tpope/vim-fugitive'
    Plug 'airblade/vim-gitgutter' " show git change
    Plug 'itchyny/lightline.vim'                        " Lightline statusbar
    Plug 'mengelbrecht/lightline-bufferline'
    Plug 'andymass/vim-matchup'
    Plug 'kyazdani42/nvim-web-devicons'
    Plug 'preservim/nerdcommenter'                      " Comment fast
    Plug 'nvim-treesitter/nvim-treesitter', {'do': ':TSUpdate'}
call plug#end()

source ~/.config/nvim/plugins/lightline.vim
source ~/.config/nvim/plugins/themes.vim
source ~/.config/nvim/plugins/treesitter.vim
source ~/.config/nvim/plugins/coc.vim
source ~/.config/nvim/plugins/git.vim
source ~/.config/nvim/plugins/float-terminal.vim
source ~/.config/nvim/plugins/fzf.vim
source ~/.config/nvim/plugins/nerdcommenter.vim

doautocmd User PlugLoaded
