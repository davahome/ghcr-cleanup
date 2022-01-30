<?php
declare(strict_types=1);

use Symfony\Component\Yaml\Yaml;

require_once __DIR__ . '/vendor/autoload.php';

// load config
$config = Yaml::parseFile(__DIR__ . '/build.yml');

// set template base values
$template = Yaml::parseFile(__DIR__ . '/template.yml');
$template['uses'] = $config['action'];

// build "runs" yaml tree
$tree = [
    'runs' => [
        'using' => 'composite',
        'steps' => [],
    ],
];

// append steps
echo 'Building actions.yml now...', PHP_EOL;
foreach ($config['scripts'] as $script) {
    echo '  - Adding script ', basename($script['path']), PHP_EOL;
    $data = $template;
    $data['name'] = $script['name'];
    $data['with']['script'] = file_get_contents(__DIR__ . '/' . $script['path']);

    $tree['runs']['steps'][] = $data;
}

// create actions.yml from base.yml and created tree
$content = file_get_contents(__DIR__ . '/base.yml') . PHP_EOL;
$content .= Yaml::dump($tree, 8, 4, Yaml::DUMP_MULTI_LINE_LITERAL_BLOCK);
file_put_contents(__DIR__ . '/action.yml', $content);
echo 'done', PHP_EOL;
