
# The following lines were added by compinstall

zstyle ':completion:*' matcher-list 'r:|[._- '\'']=** r:|=**' '' 'm:{[:lower:]}={[:upper:]}' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}'
zstyle :compinstall filename '/home/julie/.zshrc'

autoload -Uz compinit
compinit
# End of lines added by compinstall
# Lines configured by zsh-newuser-install
HISTFILE=~/.histfile
HISTSIZE=9000
SAVEHIST=9000
setopt autocd
unsetopt beep
bindkey -v
# End of lines configured by zsh-newuser-install
autoload -U colors && colors
autoload edit-command-line; zle -N edit-command-line
autoload -Uz compinit && compinit
autoload -Uz vcs_info
precmd() { vcs_info }
precmd_functions+=( precmd_vcs_info )
setopt prompt_subst
RPROMPT='${vcs_info_msg_0_} '
PROMPT='${vcs_info_msg_0_}%# '
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
alias rm="rm -i"
alias cat="bat"
untar() { tar xvf $1 }
cs() { cd $1 && ls }
aur_download() { aur sync $1 && sudo pacman -S $1}
ixupload(){ curl -F 'file=@-' 0x0.st }
video2gif() { ffmpeg -i $1 -vf "fps=10,scale=320:-1:flags=lanczos" -c:v pam -f image2pipe - | convert -delay 5 - -loop 0 -layers optimize $2 }
damnit() {sudo !!}
randomxkcd() {curl https://xkcd.com/$(shuf -i 1-2875 -n 1)/info.0.json | jq ".img, .alt" }
#alias startserver="cd ~/pengiun_mc/Da && ./start.sh"
#SAVEHIST="9000"
export PATH=$PATH:/home/julie/.spicetify:/home/julie/go/bin/:/home/julie/.local/bin
export DEVKITARM=/opt/devkitpro/devkitARM
export DEVKITPPC=/opt/devkitpro/devkitPPC
export EDITOR=nvim
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
