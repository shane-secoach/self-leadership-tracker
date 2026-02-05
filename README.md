# Coaching Follow-up Email Generator (v1)

A lightweight, manual workflow for turning coaching session minutes into a warm follow-up email, including cases where notes begin as a Quill PDF export.

## Repo structure

- `inputs/minutes.txt` — paste your latest raw session notes here.
- `inputs/example_quill_export.txt` — example of messy text copied from a Quill PDF export.
- `prompts/followup_prompt.md` — reusable prompt with tone, structure, and safety rules.
- `outputs/followup_email.md` — generated follow-up email.

## How to use

1. Open your Quill PDF and copy all text.
2. Paste it directly into `inputs/minutes.txt`.
3. Use `prompts/followup_prompt.md` as the generation instructions.
4. Generate and save the final email in `outputs/followup_email.md`.

## Version one scope

- No automation.
- No external services.
- Manual copy/paste and manual generation only.

## Writing standard (built into the prompt)

- UK English.
- Warm, human, direct coaching tone.
- First person (“I”) to second person (“you”).
- No invented details, dates, actions, or promises.
- If notes are unclear, keep wording general.
- Short paragraphs and readable flow.
