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
call plug#begin()
	Plug 'vim-airline/vim-airline'
	"Plug 'preservim/nerdtree' 
	Plug 'rust-lang/rust.vim'
	Plug 'andweeb/presence.nvim'
	Plug 'junegunn/fzf'
        Plug 'lukas-reineke/indent-blankline.nvim'
	Plug 'voldikss/vim-floaterm'
	Plug 'tpope/vim-fugitive'
	Plug 'ms-jpq/coq_nvim', {'branch': 'coq'}
	Plug 'ms-jpq/coq.artifacts', {'branch': 'artifacts'}
	Plug 'ms-jpq/coq.thirdparty', {'branch': '3p'}
	Plug 'easymotion/vim-easymotion'
	Plug 'luochen1990/rainbow'
	Plug 'nvim-lua/plenary.nvim'
	Plug 'nvim-telescope/telescope.nvim', { 'tag': '0.1.3' }
	Plug 'yuezk/vim-js'
	Plug 'maxmellon/vim-jsx-pretty'	
	Plug 'aymericbeaumet/vim-symlink'
	Plug 'moll/vim-bbye'
	Plug 'MunifTanjim/nui.nvim'
	Plug 'stevearc/oil.nvim'
	Plug 'nvim-neo-tree/neo-tree.nvim', {'branch':'v3.x'}
	Plug 'llathasa-veleth/vim-brainfuck'
        Plug 'mrcjkb/rustaceanvim'
call plug#end()
let g:airline#extensions#tabline#enabled = 1    
]])
require("oil").setup()
vim.keymap.set("n", "-", "<CMD>Oil<CR>", { desc = "Open parent directory" })
require("coq_3p") {
  { src = "builtin/ada"     },
  { src = "builtin/c"       },
  { src = "builtin/clojure" },
  { src = "builtin/css"     },
  { src = "builtin/haskell" },
  { src = "builtin/html"    },
  { src = "builtin/js"      },
  { src = "builtin/php"     },
  { src = "builtin/syntax"  },
  { src = "builtin/xml"     },

}
require("ibl").setup()
vim.opt.number = true
vim.opt.expandtab = true
vim.opt.relativenumber = true
vim.cmd("syntax enable")
vim.cmd("filetype  plugin indent on")
vim.g.airline_powerline_fonts = 1
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
vim.api.nvim_create_autocmd({ "VimEnter"}, {
        pattern = {"*"},
        command = "COQnow" 
})
