#!/bin/bash

echo 'Setting git hooks'
echo 'START'
echo '========'
echo 'Git hooks to .git/hooks'
cp ./scripts/post-checkout .git/hooks
chmod +x .git/hooks/post-checkout
echo 'End copying git hooks'
echo '========'
echo 'END'