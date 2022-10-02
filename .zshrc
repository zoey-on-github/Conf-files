
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
PS1='[%n@%m %~$] '
