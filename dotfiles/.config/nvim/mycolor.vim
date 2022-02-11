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
"let g:gruvbox_material_diagnostic_text_highlight = 1
"let g:gruvbox_material_diagnostic_line_highlight = 1
let g:gruvbox_material_diagnostic_virtual_text = 'colored'
let g:gruvbox_material_statusline_style = 'mix'
let g:gruvbox_material_better_performance = 1
let g:gruvbox_material_palette = 'mix'

colorscheme gruvbox-material
hi LineNr guifg=#b3b3b3
hi CursorLineNr guifg=#fc9867 guibg=#4B4B4B
hi CursorLine guibg=none
hi MatchParen gui=bold guibg=none guifg=#00fff7
"}}}
" Lightline {{{
let s:black = [ '#2b2b2b', 235 ]
let s:gray = [ '#323232', 236 ]
let s:white = [ '#a9b7c6', 250 ]
let s:blue = [ '#7daea3' , 109 ] 
let s:green = [ '#a9b665', 142 ] 
let s:purple = [ '#d3869b', 175 ]
let s:red = [ '#ff6b68', 204 ]
let s:yellow = [ '#ea6962', 167 ]
let s:none = [ 'NONE', 9 ]

let s:p = {'normal': {}, 'inactive': {}, 'insert': {}, 'replace': {}, 'visual': {}, 'tabline': {}}
let s:p.normal.left = [ [ s:black, s:purple ], [ s:purple, s:none ] ]
let s:p.normal.right = [ [ s:black, s:purple ], [ s:purple, s:none ] ]
let s:p.inactive.left =  [ [ s:black, s:blue ], [ s:blue, s:none ] ]
let s:p.inactive.right = [ [ s:black, s:blue ], [ s:blue, s:none ] ]
let s:p.insert.left = [ [ s:black, s:green ], [ s:green, s:none ] ] 
let s:p.insert.right = [ [ s:black, s:green ], [ s:green, s:none ] ]
let s:p.replace.left = [ [ s:black, s:red ], [ s:red, s:none ] ]
let s:p.replace.right = [ [ s:black, s:red ], [ s:red, s:none ] ]
let s:p.visual.left = [ [ s:black, s:yellow ], [ s:yellow, s:none ] ]
let s:p.visual.right = [ [ s:black, s:yellow ], [ s:yellow, s:none ] ]
let s:p.normal.middle = [ [ s:white, s:none ] ]
let s:p.inactive.middle = [ [ s:white, s:none ] ]
let s:p.tabline.left = [ [ s:purple, s:none ] ]
let s:p.tabline.tabsel = [ [ s:black, s:blue ] ]
let s:p.tabline.middle = [ [ s:blue, s:none ] ]
let s:p.tabline.right = [ [ s:black, s:blue ] ]
let s:p.normal.error = [ [ s:red, s:black ] ]
let s:p.normal.warning = [ [ s:yellow, s:black ] ]

let g:lightline#colorscheme#mycolor#palette = lightline#colorscheme#flatten(s:p)
"}}}
