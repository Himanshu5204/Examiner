import { useCallback, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import { useContext } from "react";

export function useNavigationBlocker(blocker, when = true) {
    const navigator = useContext(NavigationContext).navigator;

    useEffect(() => {
        if (!when) return;

        const push = navigator.push;
        const replace = navigator.replace;

        navigator.push = (...args) => {
            blocker(() => push.apply(navigator, args));
        };

        navigator.replace = (...args) => {
            blocker(() => replace.apply(navigator, args));
        };

        return () => {
            navigator.push = push;
            navigator.replace = replace;
        };
    }, [navigator, blocker, when]);
}
