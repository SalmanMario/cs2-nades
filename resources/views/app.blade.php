@php
    $siteName = 'CS2 Nades';
    $title = isset($meta['title']) ? "{$meta['title']} | {$siteName}" : "{$siteName} | Smoke, Flash & Molotov Lineups";
    $description = $meta['description'] ?? 'Smoke, flash, molotov and HE grenade lineups for every CS2 map, with videos and exact positions.';
    $image = isset($meta['image']) ? url($meta['image']) : null;
@endphp
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    @viteReactRefresh
    @vite(['resources/js/App.tsx'])
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    {{-- the site is dark already, stop the Dark Reader extension from recoloring it (it turned inputs red) --}}
    <meta name="darkreader-lock">

    {{-- Link previews (Discord, WhatsApp, ...). The SPA replaces the title once it loads. --}}
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description }}">
    <meta name="theme-color" content="#f97316">
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $description }}">
    @if($image)
        <meta property="og:image" content="{{ $image }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="{{ $image }}">
    @endif
</head>
<body>
<div id="app"></div>
</body>
</html>
