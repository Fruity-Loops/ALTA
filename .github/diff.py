import subprocess
import sys
import difflib

print("```")
master = sys.argv[1]
branch = sys.argv[2]

diff = ''.join(difflib.Differ().compare(master.splitlines(True), branch.splitlines(True)))
lines = [line for line in diff.splitlines() if line[0] == '+' or line[0] == '-' or line[0] == '?']
print('\n'.join(lines), end="")
