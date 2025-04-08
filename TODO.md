# backlog

<br>

- [ ] create a shared html file for footer + pagination, shated accross the pages
- [ ] create a shared html file tittle shated accross the pages
- [ ] remove all `style` from html files and customize them as classes in the css file
- [ ] clean up and optmize the css file, remove dead code
- [ ] add a linter, and an gh action for it
- [ ] check accros devices
- [ ] clean up javascript, make it minimal
- [ ] add par/even title, something like this:
```css
hr.between-posts:nth-of-type(even) + .post-title,
hr.between-posts:nth-of-type(even) + .post-title + .astro-status {
    margin-left: 0;
    margin-right: auto;
    text-align: left;
    display: block;
}
```
