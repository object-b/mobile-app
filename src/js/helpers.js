export function handleScroll(scrollContent) {
    currentScrollTop = scrollContent.scrollTop;
    scrollHeight = scrollContent.scrollHeight;
    offsetHeight = scrollContent.offsetHeight;
    reachEnd = currentScrollTop + offsetHeight >= scrollHeight;

    if (reachEnd) {
        action = 'hide';
    } else if (previousScrollTop > currentScrollTop) {
        if (currentScrollTop <= 34) {
            action = 'hide';
        } else {
            action = 'show';
        }
    } else if (currentScrollTop > 34) {
        action = 'show';
    } else {
        action = 'hide';
    }

    if (action === 'show') {
        $$('.fab').removeClass('fab-hidden');
    } else if (action === 'hide') {
        $$('.fab').addClass('fab-hidden');
    }

    previousScrollTop = currentScrollTop;
}