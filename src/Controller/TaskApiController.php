<?php

namespace App\Controller;

use App\Entity\Task;
use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/task')]
class TaskApiController extends AbstractController
{
    private TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    #[Route('/', name: 'get_task', methods: ['GET'])]
    public function getTasks(): JsonResponse
    {
        return $this->json(
            $this->taskService->getAllTasks()
        );
    }

    #[Route('/create', name: 'create_task', methods: ['POST'])]
    public function createTask(Request $request): JsonResponse
    {
        try{
            $task = $this->taskService->getTaskFromRequest($request);
        } catch (BadRequestException $exception){
            return $this->json([
                'status' => 400,
                'message' => $exception->getMessage()
            ],
                400
            );
        }

        $this->taskService->registerTask($task);

        return $this->json([
            'status' => 200,
            'message' => 'The task was successfully created !'
        ]);
    }
}
