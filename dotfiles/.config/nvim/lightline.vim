set showtabline=2
let g:lightline#bufferline#show_number = 2
let g:lightline#bufferline#enable_devicons = 1 
let g:lightline#bufferline#unicode_symbols = 1
let g:lightline#bufferline#clickable = 1
let g:lightline#bufferline#modified = ''
let g:lightline = {
      \ 'component': {
      \   'vim_logo': "",
      \   'lineinfo': "%3l:%-2c/%3{line('$')}",
      \ },
      \ 'active': {
      \   'left': [ [ 'mode', 'paste' ],
      \             [ 'gitbranch', 'readonly', 'filename', 'modified' ] ]
      \ },
      \ 'component_function': {
      \   'gitbranch': 'FugitiveHead'
      \ },
      \ }
let g:lightline.colorscheme = 'mycolor'

let g:lightline.tabline = {
                          \ 'left':  [ [ 'vim_logo', 'buffers' ] ],
                          \ 'right': []
                          \ }

let g:lightline.component_expand = {'buffers': 'lightline#bufferline#buffers'}
let g:lightline.component_type   = {'buffers': 'tabsel'}
let g:lightline.component_raw = {'buffers': 1}

let g:lightline#bufferline#composed_number_map = {
     \ 0: '0.', 1: '1.', 2: '2.', 3: '3.', 4: '4.',
     \ 5: '5.', 6: '6.', 7: '7.', 8: '8.', 9: '9.'}

" Lightline
"hi LightlineMiddle_active ctermbg=9
"hi LightlineRight_active_1 ctermbg=9
"hi LightlineRight_active_2 ctermbg=9
"hi LightlineLeft_active_1 ctermbg=9


nmap <Leader>1 <Plug>lightline#bufferline#go(1)
nmap <Leader>2 <Plug>lightline#bufferline#go(2)
nmap <Leader>3 <Plug>lightline#bufferline#go(3)
nmap <Leader>4 <Plug>lightline#bufferline#go(4)
nmap <Leader>5 <Plug>lightline#bufferline#go(5)
nmap <Leader>6 <Plug>lightline#bufferline#go(6)
nmap <Leader>7 <Plug>lightline#bufferline#go(7)
nmap <Leader>8 <Plug>lightline#bufferline#go(8)
nmap <Leader>9 <Plug>lightline#bufferline#go(9)
nmap <Leader>0 <Plug>lightline#bufferline#go(10)
" Delete buffers
nmap <Leader>c1 <Plug>lightline#bufferline#delete(1)
nmap <Leader>c2 <Plug>lightline#bufferline#delete(2)
nmap <Leader>c3 <Plug>lightline#bufferline#delete(3)
nmap <Leader>c4 <Plug>lightline#bufferline#delete(4)
nmap <Leader>c5 <Plug>lightline#bufferline#delete(5)
nmap <Leader>c6 <Plug>lightline#bufferline#delete(6)
nmap <Leader>c7 <Plug>lightline#bufferline#delete(7)
nmap <Leader>c8 <Plug>lightline#bufferline#delete(8)
nmap <Leader>c9 <Plug>lightline#bufferline#delete(9)
nmap <Leader>c0 <Plug>lightline#bufferline#delete(10)
