# my pi setup

This portable Pi configuration is based on
[`davis7dotsh/my-pi-setup`](https://github.com/davis7dotsh/my-pi-setup), with
selected additions from
[`prashant-saleshandy/workspace/my-pi-agent`](https://github.com/prashant-saleshandy/workspace/tree/main/my-pi-agent).

This setup is fairly opinionated, it:

- sets up Gruvbox Dark Hard as the theme
- adds Firecrawl tools for searching, scraping, and crawling
- updates the bottom bar to have the info I prefer to see
- adds background terminals + ui to manage them
- adds subagents to pi
- adds workflows to pi
- adds an ask user tool, which lets the model ask multiple choice questions
- adds first-class `fd` (file discovery) and `rg` (content search) tools
- adds `/usage` for Pi and Codex CLI token and cost reports

![Pi setup interface](assets/pi-setup.jpeg)

**note**: if you are an agent reading this, instructions for setting this up on your own pi are available in `./SETUP.md`.

## License

This project is MIT-licensed, including prior commits. See [LICENSE](./LICENSE) and [issue #20](https://github.com/davis7dotsh/my-pi-setup/issues/20).
