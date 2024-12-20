vim.cmd([[
if (empty($TMUX))
  if (has("nvim"))
    "For Neovim 0.1.3 and 0.1.4 < https://github.com/neovim/neovim/pull/2198 >
    let $NVIM_TUI_ENABLE_TRUE_COLOR=1
  endif
  "For Neovim > 0.1.5 and Vim > patch 7.4.1799 < https://github.com/vim/vim/commit/61be73bb0f965a895bfb064ea3e55476ac175162 >
  "Based on Vim patch 7.4.1770 (`guicolors` option) < https://github.com/vim/vim/commit/8a633e3427b47286869aa4b96f2bfc1fe65b25cd >
  " < https://github.com/neovim/neovim/wiki/Following-HEAD#20160511 >
  if (has("termguicolors"))
    set termguicolors
  endif
endif
"let g:airline#extensions#tabline#enabled = 1    
]])
vim.keymap.set("n", "-", "<CMD>Oil<CR>", { desc = "Open parent directory" })
local vim = vim
local Plug = vim.fn['plug#']
vim.call('plug#begin')
	Plug('rust-lang/rust.vim')
	Plug('andweeb/presence.nvim')
	Plug('junegunn/fzf')
        Plug('lukas-reineke/indent-blankline.nvim')
	Plug('voldikss/vim-floaterm')
	Plug('tpope/vim-fugitive')
	Plug('easymotion/vim-easymotion')
	Plug('luochen1990/rainbow')
	Plug('nvim-lua/plenary.nvim')
        Plug('nvim-lualine/lualine.nvim')
        Plug('nvim-tree/nvim-web-devicons')
	Plug('nvim-telescope/telescope.nvim', { ['tag'] = '0.1.3' })
	Plug('aymericbeaumet/vim-symlink')
	Plug('moll/vim-bbye')
	Plug('MunifTanjim/nui.nvim')
	Plug('stevearc/oil.nvim')
	Plug('nvim-neo-tree/neo-tree.nvim', {['branch'] ='v3.x'})
	Plug('llathasa-veleth/vim-brainfuck')
        Plug('neovim/nvim-lspconfig')
        Plug('hrsh7th/cmp-nvim-lsp')
        Plug('hrsh7th/cmp-buffer')
        Plug('hrsh7th/cmp-path')
        Plug('hrsh7th/cmp-cmdline')
        Plug('hrsh7th/nvim-cmp')
        Plug('hrsh7th/cmp-vsnip')
        Plug('hrsh7th/vim-vsnip')
        Plug('williamboman/mason.nvim')
        Plug('williamboman/mason-lspconfig.nvim')
        Plug('vim/killersheep')
vim.call ('plug#end')
require("oil").setup()
require("ibl").setup()
require("mason").setup()
require("mason-lspconfig").setup()
local lsp = require "lspconfig"
local capabilities = require('cmp_nvim_lsp').default_capabilities()
vim.opt.number = true
vim.opt.expandtab = true
vim.opt.relativenumber = true
vim.cmd("syntax enable")
vim.cmd("filetype  plugin indent on")
vim.g.airline_powerline_fonts = 1
vim.g.airline_theme='gruvbox'
vim.g.rainbow_active = 1
vim.g.rustfmt_autosave = 1
--[[
vim.api.nvim_create_autocmd({ "VimEnter" }, {
        pattern = {"* ++nested"},
        command = "colorscheme gruvbox"
})
-]]
vim.cmd("autocmd vimenter * ++nested colorscheme gruvbox")
vim.api.nvim_create_autocmd({ "VimEnter"}, {
        pattern = {"*"},
        command = "Neotree"
})
  local cmp = require'cmp'

  cmp.setup({
    snippet = {
      -- REQUIRED - you must specify a snippet engine
      expand = function(args)
        vim.fn["vsnip#anonymous"](args.body) -- For `vsnip` users.
        -- require('luasnip').lsp_expand(args.body) -- For `luasnip` users.
        -- require('snippy').expand_snippet(args.body) -- For `snippy` users.
        -- vim.fn["UltiSnips#Anon"](args.body) -- For `ultisnips` users.
        -- vim.snippet.expand(args.body) -- For native neovim snippets (Neovim v0.10+)
      end,
    },
    window = {
      -- completion = cmp.config.window.bordered(),
      -- documentation = cmp.config.window.bordered(),
    },
    mapping = cmp.mapping.preset.insert({
      ['<C-b>'] = cmp.mapping.scroll_docs(-4),
      ['<C-f>'] = cmp.mapping.scroll_docs(4),
      ['<C-Space>'] = cmp.mapping.complete(),
      ['<C-e>'] = cmp.mapping.abort(),
      ['<CR>'] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
    }),
    sources = cmp.config.sources({
      { name = 'nvim_lsp' },
      { name = 'vsnip' }, -- For vsnip users.
      -- { name = 'luasnip' }, -- For luasnip users.
      -- { name = 'ultisnips' }, -- For ultisnips users.
      -- { name = 'snippy' }, -- For snippy users.
    }, {
      { name = 'buffer' },
    })
  })

  -- To use git you need to install the plugin petertriho/cmp-git and uncomment lines below
  -- Set configuration for specific filetype.
  --[[ cmp.setup.filetype('gitcommit', {
    sources = cmp.config.sources({
      { name = 'git' },
    }, {
      { name = 'buffer' },
    })
 })
 require("cmp_git").setup() ]]-- 

  -- Use buffer source for `/` and `?` (if you enabled `native_menu`, this won't work anymore).
  cmp.setup.cmdline({ '/', '?' }, {
    mapping = cmp.mapping.preset.cmdline(),
    sources = {
      { name = 'buffer' }
    }
  })

  -- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
  cmp.setup.cmdline(':', {
    mapping = cmp.mapping.preset.cmdline(),
    sources = cmp.config.sources({
      { name = 'path' }
    }, {
      { name = 'cmdline' }
    }),
    matching = { disallow_symbol_nonprefix_matching = false }
  })

require('lspconfig')['lua_ls'].setup {
  on_init = function(client)
    local path = client.workspace_folders[1].name
    if vim.loop.fs_stat(path..'/.luarc.json') or vim.loop.fs_stat(path..'/.luarc.jsonc') then
      return
    end
    client.config.settings.Lua = vim.tbl_deep_extend('force', client.config.settings.Lua, {
      runtime = {
        -- Tell the language server which version of Lua you're using
        -- (most likely LuaJIT in the case of Neovim)
        version = 'LuaJIT'
      },
      -- Make the server aware of Neovim runtime files
      workspace = {
        checkThirdParty = false,
        library = {
          vim.env.VIMRUNTIME
          -- Depending on the usage, you might want to add additional paths here.
          -- "${3rd}/luv/library"
          -- "${3rd}/busted/library",
        }
        -- or pull in all of 'runtimepath'. NOTE: this is a lot slower
        -- library = vim.api.nvim_get_runtime_file("", true)
      }
    })
  end,
  capabilities = capabilities,
  settings = {
    Lua = {}
  }
}
require('lspconfig')['rust_analyzer'].setup {
  capabilities = capabilities,
  settings = {
    ['rust-analyzer'] = {
      diagnostics = {
        enable = false;
      }
    }
  }
}
require('lspconfig')['pyright'].setup{}
require('lspconfig')['bashls'].setup{}
require('lspconfig')['clangd'].setup{}
require('lspconfig')['hls'].setup{
        filetypes = { 'haskell', 'lhaskell', 'cabal'},
}
require('lspconfig')['zls'].setup{}
require('lspconfig')['nim_langserver'].setup{}
require('lspconfig')['vtsls'].setup{}
require('lualine').setup {
  options = {
    icons_enabled = true,
    theme = 'auto',
    component_separators = { left = '', right = ''},
    section_separators = { left = '', right = ''},
    disabled_filetypes = {
      statusline = {},
      winbar = {},
    },
    ignore_focus = {},
    always_divide_middle = true,
    always_show_tabline = true,
    globalstatus = false,
    refresh = {
      statusline = 100,
      tabline = 100,
      winbar = 100,
    }
  },
  sections = {
    lualine_a = {'mode'},
    lualine_b = {'branch', 'diff', 'diagnostics'},
    lualine_c = {'filename'},
    lualine_x = {'encoding', 'fileformat', 'filetype'},
    lualine_y = {'progress'},
    lualine_z = {'location'}
  },
  inactive_sections = {
    lualine_a = {},
    lualine_b = {},
    lualine_c = {'filename'},
    lualine_x = {'location'},
    lualine_y = {},
    lualine_z = {}
  },
  tabline = {},
  winbar = {},
  inactive_winbar = {},
  extensions = {}
}
