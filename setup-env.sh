#!/bin/bash

# Убедитесь, что текущая директория содержит dist/assets/
cd /usr/share/nginx/html/assets || { echo "Directory dist/assets/ does not exist"; exit 1; }

# Печать всех переменных окружения
env

# Список всех файлов в директории
for file in *; do
    echo "$file"
    if [[ "$file" != *.js ]]; then
        continue
    fi

    # Собираем переменные окружения, начинающиеся с VITE_APP_
    declare -A viteEnvs
    while IFS='=' read -r key value; do
        if [[ "$key" == VITE_APP_* ]]; then
            strippedKey=${key/VITE_APP_/}
            viteEnvs["$strippedKey"]="$value"
        fi
    done < <(env)

    echo "viteEnvs" "${viteEnvs[@]}"

    # Замена VITE_APP_ переменных в файле
    content=$(<"$file")
    for key in "${!viteEnvs[@]}"; do
        content=${content//%VITE_APP_$key%/${viteEnvs[$key]}}
    done

    # Запись обратно в файл
    echo "$content" > "$file"
done
