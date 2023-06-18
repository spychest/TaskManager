<?php

namespace App\Controller;

use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

class MercureController extends AbstractController
{
    private HubInterface $hub;
    private TaskService $taskService;

    public function __construct(HubInterface $hub, TaskService $taskService)
    {
        $this->hub = $hub;
        $this->taskService = $taskService;
    }

    #[Route('/publish', name: 'publish')]
    public function publish(HubInterface $hub): Response
    {
        $update = new Update(
            'https://localhost/books/1',
            json_encode(['status' => 'Hello World !'])
        );

        $this->hub->publish($update);

        return new Response('published!');
    }
}
