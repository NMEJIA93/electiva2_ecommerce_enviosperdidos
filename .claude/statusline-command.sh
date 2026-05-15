#!/bin/bash
# Claude Code statusline - uses node.js for JSON parsing (no jq required)

input=$(cat)

# Parse JSON with node.js
used_pct=$(echo "$input" | node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ try{ const o=JSON.parse(d); console.log(o?.context_window?.used_percentage??''); }catch(e){} })" 2>/dev/null)
cwd=$(echo "$input" | node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ try{ const o=JSON.parse(d); console.log(o?.workspace?.current_dir||o?.cwd||''); }catch(e){} })" 2>/dev/null)
model=$(echo "$input" | node -e "let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{ try{ const o=JSON.parse(d); console.log(o?.model?.display_name||''); }catch(e){} })" 2>/dev/null)

# ANSI colors
RED=$'\033[31m'
YELLOW=$'\033[33m'
GREEN=$'\033[32m'
BLUE=$'\033[34m'
MAGENTA=$'\033[35m'
CYAN=$'\033[36m'
RESET=$'\033[0m'

# Build progress bar (20 blocks)
build_bar() {
  local pct="${1:-0}"
  local pct_int=$(printf "%.0f" "$pct" 2>/dev/null || echo 0)
  local filled=$(( pct_int * 20 / 100 ))
  local empty=$(( 20 - filled ))
  local bar=""

  for i in $(seq 1 $filled); do bar="${bar}█"; done
  for i in $(seq 1 $empty);  do bar="${bar}░"; done

  if [ "$pct_int" -ge 80 ]; then
    echo "${RED}[${bar}]${RESET}"
  elif [ "$pct_int" -ge 50 ]; then
    echo "${YELLOW}[${bar}]${RESET}"
  else
    echo "${GREEN}[${bar}]${RESET}"
  fi
}

# Shorten path
if [ -n "$cwd" ]; then
  short_cwd="${cwd/#$HOME/\~}"
else
  short_cwd="?"
fi

# Git branch
git_branch=""
if [ -n "$cwd" ] && [ -d "$cwd/.git" ]; then
  git_branch=$(git -C "$cwd" --no-optional-locks symbolic-ref --short HEAD 2>/dev/null)
fi

# Assemble statusline
if [ -n "$used_pct" ]; then
  bar=$(build_bar "$used_pct")
  pct_rounded=$(printf "%.0f" "$used_pct")
  line="${bar} ${pct_rounded}%"
else
  line="${GREEN}[░░░░░░░░░░░░░░░░░░░░]${RESET} --%"
fi

line="${line}  ${BLUE}${short_cwd}${RESET}"

if [ -n "$git_branch" ]; then
  line="${line}  ${MAGENTA}⎇ ${git_branch}${RESET}"
fi

if [ -n "$model" ]; then
  line="${line}  ${CYAN}${model}${RESET}"
fi

echo "$line"
