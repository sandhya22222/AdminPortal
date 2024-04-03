import { useEffect } from 'react'
import { Favicon } from '../constants/media'

/**
 * ! useFavicon is a custom hook designed to update app Favicon.
 * ! The main purpose of this custom hook is to change the application favicon.
 * ? Use of this custom hook
 * ? We can import this custom hook in any of the react component and can call this hook in that component.
 * ! How to use this custom hook in a component.
 * ? import useFavicon from "../../hooks/useFavicon";
 * * from path my vary based on the component & this custom hook directory.
 * * Call useFavicon hook in App.js.
 * ? useFavicon();
 * */

export const useFavicon = () => {
    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.getElementsByTagName('head')[0].appendChild(link)
        }
        link.href = Favicon
    }, [])
}
