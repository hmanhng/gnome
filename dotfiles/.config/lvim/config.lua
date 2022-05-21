-- general
vim.opt.cmdheight = 1
vim.opt.wrap = true
vim.wo.foldmethod = "indent"
-- vim.wo.foldnestmax = 10
-- vim.wo.foldlevel = 2
vim.wo.cursorlineopt = "both"
vim.wo.linebreak = true
vim.wo.list = true
vim.wo.listchars = "tab:>-,trail:~,extends:>,precedes:<"
lvim.log.level = "warn"
lvim.format_on_save = true
lvim.colorscheme = "onedarker"

-- keymappings [view all the defaults by pressing <leader>Lk]
lvim.leader = "space"
vim.cmd([[
  nnoremap <ESC><ESC> :silent! nohls<CR>
  noremap <silent> <expr> j (v:count == 0 ? 'gj' : 'j')
  noremap <silent> <expr> k (v:count == 0 ? 'gk' : 'k')
  nnoremap <leader>l :bnext<CR>
  nnoremap <leader>h :bprevious<CR>
]])
lvim.keys.normal_mode["<C-s>"] = ":w<cr>"
lvim.keys.normal_mode["<C-q>"] = ":q<cr>"

-- lualine
lvim.builtin.lualine.style = "lvim"
local components = require("lvim.core.lualine.components")
lvim.builtin.lualine.options.component_separators = { left = '', right = '' }
lvim.builtin.lualine.options.section_separators = { left = '', right = '' }
lvim.builtin.lualine.sections.lualine_a = { "mode" }
lvim.builtin.lualine.sections.lualine_y = {
  components.spaces
}
lvim.builtin.lualine.sections.lualine_z = {
  components.location,
  components.scrollbar
}

-- TODO: User Config for predefined plugins
-- After changing plugin config exit and reopen LunarVim, Run :PackerInstall :PackerCompile
lvim.builtin.alpha.active = true
lvim.builtin.alpha.mode = "dashboard"
lvim.builtin.notify.active = true
lvim.builtin.terminal.active = true
lvim.builtin.nvimtree.setup.view.side = "left"
lvim.builtin.nvimtree.show_icons.git = 1

-- if you don't want all the parsers change this to a table of the ones you want
lvim.builtin.treesitter.ensure_installed = {
  "bash",
  "c",
  "cpp",
  "c_sharp",
  "comment",
  "javascript",
  "json",
  "lua",
  "python",
  "typescript",
  "tsx",
  "css",
  "rust",
  "java",
  "vim",
  "yaml",
}

lvim.builtin.treesitter.ignore_install = { "haskell" }
lvim.builtin.treesitter.rainbow = { enable = true, extended_mode = true, max_file_lines = nil }
lvim.builtin.treesitter.matchup.enable = true

-- generic LSP settings
lvim.lsp.templates_dir = join_paths(get_runtime_dir(), "after", "ftplugin")
require("lvim.lsp.manager").setup("csharp_ls")

-- Additional Plugins
lvim.plugins = {
  { "andymass/vim-matchup",
    config = function()
      vim.cmd([[
        hi MatchWord guifg=#00fff7 gui=bold
        hi MatchWordCur guifg=#00fff7 gui=bold
      ]])
    end
  },
  { "p00f/nvim-ts-rainbow" }
}
-- Autocommands (https://neovim.io/doc/user/autocmd.html)
-- lvim.autocommands.custom_groups = {
--   { "BufWinEnter", "*.lua", "setlocal ts=8 sw=8" },
-- }
