" Vimscript file settings folding {{{
augroup filtetype_vim
  autocmd!
  autocmd FileType vim setlocal foldmethod=marker foldlevel=0
augroup END
" }}}

" Settings {{{
source ~/.config/nvim/plugins.vim
source ~/.config/nvim/options.vim
source ~/.config/nvim/keymaps.vim
" }}}