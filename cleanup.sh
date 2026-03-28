#!/bin/bash
# Script de limpieza y optimización del proyecto Compufest 2026

echo "🧹 Iniciando limpieza del proyecto..."

# Limpiar directorios de caché
echo "📁 Limpiando directorios de caché..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Remover archivos sin usar
echo "🗑️  Removiendo archivos innecesarios..."
rm -f meshline.d.ts 2>/dev/null || true
rm -rf Compu-Fest* 2>/dev/null || true

# Limpiar node_modules y reinstalar
echo "📦 Reinstalando dependencias limpias..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install --legacy-peer-deps 2>&1 | tail -5

echo "✅ Limpieza completada!"
echo "📋 Para ver el registro de optimizaciones, revisa: OPTIMIZATION_LOG.md"
echo ""
echo "💡 Próximos pasos:"
echo "   1. npm run dev          (Iniciar servidor de desarrollo)"
echo "   2. npm run build        (Compilar para producción)"
echo "   3. npm run lint         (Verificar código)"
