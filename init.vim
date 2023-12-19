"Use 24-bit (true-color) mode in Vim/Neovim when outside tmux.
"If you're using tmux version 2.2 or later, you can remove the outermost $TMUX check and use tmux's 24-bit color support
"(see < http://sunaku.github.io/tmux-24bit-color.html#usage > for more information.)
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
	Plug 'voldikss/vim-floaterm'
	Plug 'tpope/vim-fugitive'
	Plug 'neoclide/coc.nvim', {'branch': 'release'}
	Plug 'github/copilot.vim'
	Plug 'easymotion/vim-easymotion'
	Plug 'luochen1990/rainbow'
	Plug 'nvim-lua/plenary.nvim'
	Plug 'nvim-telescope/telescope.nvim', { 'tag': '0.1.3' }
	Plug 'yuezk/vim-js'
	Plug 'maxmellon/vim-jsx-pretty'	
	Plug 'aymericbeaumet/vim-symlink'
	Plug 'moll/vim-bbye'
	Plug 'MunifTanjim/nui.nvim'
	Plug 'nvim-neo-tree/neo-tree.nvim', {'branch':'v3.x'}
call plug#end()
autocmd vimenter * ++nested colorscheme gruvbox
let g:airline#extensions#tabline#enabled = 1
" Start NERDTree and leave the cursor in it.
"autocmd vimenter * NERDTree
autocmd vimenter * Neotree
autocmd vimenter * Copilot disable
nnoremap <leader>n :NERDTreeFocus<CR>
:let mapleader = ","
let g:airline_powerline_fonts = 1
:set relativenumber
:set number
syntax enable
filetype plugin indent on
let NERDTreeShowHidden=1
nnoremap <Leader>sv :source $MYVIMRC<CR>
let g:rustfmt_autosave = 1
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm()
                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction
let g:rainbow_active = 1
