<img src="/looking_glass_icon.png"  width="32px" height="32px"> GNOME Fuzzy App Search
==================

[Fuzzy](https://en.wikipedia.org/wiki/Approximate_string_matching) application search results for [Gnome Search](https://developer.gnome.org/SearchProvider/). Forked from [gnome-fuzzy-search](https://github.com/fffilo/gnome-fuzzy-search).

## Install

### Install from extensions.gnome.org

Go to the GNOME Extensions page of this extension and click on the switch to install.

### Install from AUR

You can install GNOME Fuzzy App Search from the AUR package [`gnome-fuzzy-app-search-git`](https://aur.archlinux.org/packages/gnome-fuzzy-app-search-git).

### Install from source

 - Download and unpack [the highest release](https://gitlab.com/Czarlie/gnome-fuzzy-app-search/-/releases) from [the Gitlab repo](https://gitlab.com/Czarlie/gnome-fuzzy-app-search) or `git clone https://gitlab.com/Czarlie/gnome-fuzzy-app-search`
 - Run `make install` inside the `gnome-fuzzy-app-search` root directory
 - On X11, you can press `Alt`+`F2`, enter `r` and press `Enter` to reload extensions (and everything else, too). On Wayland, or if you choose not to reload, the extension will be loaded on your next login.

## How It Works

The plugin injects its own callback to `getResultSet` method in each registered provider, appending new search results.
This means that it does not remove Gnome's results, just adds new results to existing ones.

The search query is split up into words and [**Levenshtein distances**](https://en.wikipedia.org/wiki/Levenshtein_distance) to the words in the app names are calculated, scored and used to display fuzzy search results.

![fuzzy search enabled](screenshot_after.png "Fuzzy Search Enabled")

## Where is this project headed?

Gnome 40 support is planned, but will probably be done at the same time as some restructuring, so I am putting it off for one or two weeks, May or June 2021. Updates on that here: #4. If you'd like it before then, I am always happy to approve of merge requests.

Although [the extension this is forked from](https://github.com/fffilo/gnome-fuzzy-search) did have [plans](https://github.com/fffilo/gnome-fuzzy-search/issues/1#issuecomment-445189640) to extend more search providers, other providers currently aren't being actively developed by me, @Czarlie, but I am not entirely ruling it out. 
