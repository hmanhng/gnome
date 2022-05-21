" Colorscheme {{{

set background=dark
let g:gruvbox_material_background = 'soft'
let g:gruvbox_material_enable_bold = 1
let g:gruvbox_material_enable_italic = 1
let g:gruvbox_material_cursor = 'auto'
let g:gruvbox_material_transparent_background = 1
let g:gruvbox_material_visual = 'grey background' "`'grey background'`, `'green background'`, `'blue background'`, `'red background'`, `'reverse'`
let g:gruvbox_material_menu_selection_background = 'aqua'
let g:gruvbox_material_ui_contrast = 'high'
" let g:gruvbox_material_diagnostic_text_highlight = 1
" let g:gruvbox_material_diagnostic_line_highlight = 1
let g:gruvbox_material_diagnostic_virtual_text = 'colored'
let g:gruvbox_material_statusline_style = 'mix'
let g:gruvbox_material_better_performance = 1
let g:gruvbox_material_palette = 'mix'

" Vim
let g:onedark_config = {
    \ 'style': 'warm',
\}
colorscheme gruvbox-material
hi LineNr guifg=#b3b3b3
hi CursorLineNr guifg=#fc9867 guibg=#4B4B4B
hi CursorLine guibg=none
hi MatchParen gui=bold guibg=none guifg=#00fff7

" }}}
