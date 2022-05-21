let g:floaterm_width = 0.8
let g:floaterm_height = 0.8
let g:floaterm_keymap_toggle = '<leader>t'
nnoremap <leader>gcc :cd %:p:h<CR>:FloatermNew --autoclose=0 gcc % -o %< && ./%<<CR>
nnoremap <leader>g++ :FloatermNew --autoclose=0 g++ % -o prog && ./prog<CR>