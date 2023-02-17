import { useEffect } from "react";

/**
 * ! usePageTitle is a custom hook designed to update page title.
 * ! The main purpose of this custom hook is to change the page title based on which current active page.
 * ? Use of this custom hook
 * ? We can import this custom hook in any of the react component and can call this hook by passing title for that component.
 * ! How to use this custom hook in a component.
 * ? import usePageTitle from "../../hooks/usePageTitle";
 * * from path my vary based on the component & this custom hook directory.
 * * Call usePageTitle hook which updates the title as soon as the component mounts and reverts it to the previous title when it unmounts.
 * ? usePageTitle("Home - DigitMarket");
 * */

export const usePageTitle = (newTitle) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = newTitle;
    return () => {
      document.title = prevTitle;
    };
  }, [newTitle]);
};
