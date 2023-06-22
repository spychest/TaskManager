<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    private string $mercureTopicUrl;

    public function __construct(string $mercureTopicUrl)
    {
        $this->mercureTopicUrl = $mercureTopicUrl;
    }

    #[Route('/', name: 'app_main')]
    public function index(): Response
    {
        return $this->render('task/index.html.twig', [
            'mercureTopicUrl' => $this->mercureTopicUrl,
        ]);
    }
}
