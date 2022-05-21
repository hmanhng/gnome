lua <<EOF
require'nvim-treesitter.configs'.setup {
  ensure_installed = {
      "bash",
      "c",
      "cpp",
      "c_sharp",
      "css",
      "dockerfile",
      "go",
      "html",
      "javascript",
      "json",
      "lua",
      "php",
      "prisma",
      "python",
      "regex",
      "scss",
      "tsx",
      "typescript",
      "vim",
      "vue",
      "yaml",
    },
  highlight = {
    -- `false` will disable the whole extension
    enable = true,
    additional_vim_regex_highlighting = false,
  },
  --  matchup = {
  --  enable = true,              -- mandatory, false will disable the whole extension
    --disable = { "c", "ruby" },  -- optional, list of language that will be disabled
  -- },
}
EOF
