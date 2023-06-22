<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Annotation\Route;

class MercureController extends AbstractController
{
    private HubInterface $hub;

    private string $mercureTopicUrl;

    public function __construct(HubInterface $hub, string $mercureTopicUrl)
    {
        $this->hub = $hub;
        $this->mercureTopicUrl = $mercureTopicUrl;
    }

    #[Route('/publish', name: 'publish')]
    public function publish(HubInterface $hub): Response
    {
        $update = new Update(
            $this->mercureTopicUrl,
            json_encode([
                'status' => 'update published',
            ])
        );

        $this->hub->publish($update);

        return new Response('published!');
    }
}
