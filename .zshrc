
# The following lines were added by compinstall

zstyle ':completion:*' matcher-list 'r:|[._- '\'']=** r:|=**' '' 'm:{[:lower:]}={[:upper:]}' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}'
zstyle :compinstall filename '/home/julie/.zshrc'

autoload -Uz compinit
compinit
# End of lines added by compinstall
# Lines configured by zsh-newuser-install
setopt autocd
unsetopt beep
bindkey -v
# End of lines configured by zsh-newuser-install
autoload -U colors && colors
autoload edit-command-line; zle -N edit-command-line
PS1='[%n@%m %~]$ '
bindkey -M vicmd v edit-command-line
#aliases
alias icd="cd ~ && cd \$(find * -type d | fzf)"
alias rainbowfetch="neofetch| lolcat" 
alias neovim="nvim"
alias awconf="cd ~/.config/awesome" 
alias doom="~/.config/emacs/bin/doom"
alias lgit="lazygit"
alias zc="nvim .zshrc"
alias ls="ls -la --color"
alias grep="grep --color"
SAVEHIST="9000"
export PATH=$PATH:/home/julie/.spicetify
