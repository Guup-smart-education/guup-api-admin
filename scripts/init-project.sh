#!/bin/bash

echo 'Setting develop project environment'
echo 'START'
echo '========'
echo 'Copying git hooks to .git/hooks'
cp ./scripts/post-checkout .git/hooks
chmod +x .git/hooks/post-checkout
echo 'End copying git hooks'
echo '========'
echo 'END'