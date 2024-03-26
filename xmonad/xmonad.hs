import XMonad
import XMonad.Actions.Volume
import XMonad.Config.Desktop
import XMonad.Util.EZConfig
import XMonad.Operations
import XMonad.Layout.ThreeColumns
import System.IO
import Graphics.X11.ExtraTypes.XF86
import XMonad.Hooks.EwmhDesktops
import XMonad.Hooks.DynamicLog
import XMonad.Hooks.StatusBar
import XMonad.Hooks.StatusBar.PP
import XMonad.Layout.IndependentScreens
import qualified XMonad.StackSet as W
import XMonad.Util.CustomKeys
import XMonad.Layout.ToggleLayouts
import XMonad.Layout.NoBorders
import XMonad.Layout.Tabbed (tabbedAlways, shrinkText, Theme(..))
import XMonad.Layout.ResizableTile (ResizableTall(..), MirrorResize(..))
import XMonad.Util.Loggers
baseConfig = desktopConfig

main :: IO()
main = xmonad
        . ewmhFullscreen
        . ewmh
        . withEasySB (statusBarProp "xmobar ~/.xmonad/xmobar.hs" (pure def)) defToggleStrutsKey
        $ myConfig
myConfig = def 
   { modMask = mod4Mask
   , layoutHook = myLayout
   }
   { terminal = "kitty"
   }
   { workspaces = withScreens 2 ["web", "email", "irc", "otherspace", "five", "six", "seven", "eight", "nine"]
   }
   `additionalKeysP`
   [ ("M-f", spawn "firefox-developer-edition"      )
   , ("M-S-s", spawn "flameshot gui")
--   , ("M-S-f", sendMessage (Toggle "Full"))
   , ("<XF86AudioRaiseVolume>", spawn "amixer set Master 5%+")
   , ("<XF86AudioLowerVolume>", spawn "amixer set Master 5%-")
   , ("<XF86AudioMute>", spawn "amixer set Master 0%")
    ]
    `additionalKeys`
        [((m .|. mod4Mask, k), windows $ onCurrentScreen f i)
        | (i, k) <- zip (workspaces' myConfig) [xK_1 .. xK_9]
        , (f, m) <- [(W.greedyView, 0), (W.shift, shiftMask)]
     --   , ((0, xF86XK_AudioLowerVolume   ), spawn "amixer set Master 2-")
     --   , ((0, xF86XK_AudioRaiseVolume   ), spawn "amixer set Master 2+")
     --   , ((0, xF86XK_AudioMute          ), spawn "amixer set Master toggle")
        ]

myLayout = tiled ||| Mirror tiled ||| Full ||| ThreeColMid 1 (3/100) (1/2)
      where
        tiled = Tall nmaster delta ratio
        nmaster = 1
        ratio = 1/2
        delta = 3/100

myXmobarPP :: PP
myXmobarPP = def
    { ppSep             = magenta " • "
    , ppTitleSanitize   = xmobarStrip
    , ppCurrent         = wrap " " "" . xmobarBorder "Top" "#8be9fd" 2
    , ppHidden          = white . wrap " " ""
    , ppHiddenNoWindows = lowWhite . wrap " " ""
    , ppUrgent          = red . wrap (yellow "!") (yellow "!")
    , ppOrder           = \[ws, l, _, wins] -> [ws, l, wins]
    , ppExtras          = [logTitles formatFocused formatUnfocused]
    }
  where
    formatFocused   = wrap (white    "[") (white    "]") . magenta . ppWindow
    formatUnfocused = wrap (lowWhite "[") (lowWhite "]") . blue    . ppWindow

    -- | Windows should have *some* title, which should not not exceed a
    -- sane length.
    ppWindow :: String -> String
    ppWindow = xmobarRaw . (\w -> if null w then "untitled" else w) . shorten 30

    blue, lowWhite, magenta, red, white, yellow :: String -> String
    magenta  = xmobarColor "#ff79c6" ""
    blue     = xmobarColor "#bd93f9" ""
    white    = xmobarColor "#f8f8f2" ""
    yellow   = xmobarColor "#f1fa8c" ""
    red      = xmobarColor "#ff5555" ""
    lowWhite = xmobarColor "#bbbbbb" ""

