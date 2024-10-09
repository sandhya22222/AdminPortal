import { lazy } from 'react'

const lazyRetry = function (componentImport) {
    return new Promise((resolve, reject) => {
        const hasRefreshed = JSON.parse(window.sessionStorage.getItem('retry-lazy-refreshed') || 'false')
        componentImport()
            .then((component) => {
                window.sessionStorage.setItem('retry-lazy-refreshed', 'false')
                resolve(component)
            })
            .catch((error) => {
                if (!hasRefreshed) {
                    // not been refreshed yet
                    window.sessionStorage.setItem('retry-lazy-refreshed', 'true')
                    return window.location.reload() // refresh the page
                }

                reject(error)
            })
    })
}
export const lazyWithRetry = (importFunc) => {
    return lazy(() => lazyRetry(importFunc))
}
