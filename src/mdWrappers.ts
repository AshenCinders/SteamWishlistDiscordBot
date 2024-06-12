// String wrappers for converting to markdown syntax.

// ANSI escape codes from:
// https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06

// Wrappers to create ANSI colors.
// Color strings need to be wrapped with a markdown code block with lang ansi.

export function gray(str: string): string {
    return '\u001b[0;30m' + str + '\u001b[0;0m';
}

export function pink(str: string): string {
    return '\u001b[0;35m' + str + '\u001b[0;0m';
}

export function red(str: string): string {
    return '\u001b[0;31m' + str + '\u001b[0;0m';
}

export function yellow(str: string): string {
    return '\u001b[0;33m' + str + '\u001b[0;0m';
}

export function green(str: string): string {
    return '\u001b[0;32m' + str + '\u001b[0;0m';
}

export function blue(str: string): string {
    return '\u001b[0;34m' + str + '\u001b[0;0m';
}

export function cyan(str: string): string {
    return '\u001b[0;36m' + str + '\u001b[0;0m';
}

// Code block wrapper for ANSI colors.
export function wrapColors(str: string): string {
    return '```ansi\n' + str + '\n```';
}

