(() => {
    const elements = document.querySelectorAll("*");

    let colors = new Set();
    let fonts = new Set();

    elements.forEach(el => {
        const style = window.getComputedStyle(el);

        if (style.color && style.color !== "rgba(0, 0, 0, 0)") {
            colors.add(style.color);
        }

        if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
            colors.add(style.backgroundColor);
        }

        if (style.fontFamily) {
            fonts.add(style.fontFamily);
        }
    });

    return {
        colors: Array.from(colors).slice(0, 20),
        fonts: Array.from(fonts)
    };
})();