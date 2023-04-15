<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StoreNewEventTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test storing new event
     *
     * @return void
     */
    public function test_storing_new_event()
    {
        $userData = User::factory()->create()->toArray();

        $csrfToken = $this->login($userData);

        // event data
        $eventData["title"] = "My New Event";
        $eventData["description"] = "This is new event's description.";
        $eventData["latitude"] = 55;
        $eventData["longitude"] = 54;
        $eventData["start_time"] = '10:30';
        $eventData["date"] = '2023-05-10';

        $response = $this->post('/api/events', $eventData, [
            'X-XSRF-TOKEN' => $csrfToken,
            'Referer' => 'localhost:3000',
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Stored successfuly'
        ]);
        
    }

    /**
     * Test validation messages
     *
     * @return void
     */
    public function test_validation_messages()
    {
        $userData = User::factory()->create()->toArray();

        $csrfToken = $this->login($userData);

        // event data
        $eventData["title"] = "My New Event";
        $eventData["description"] = null;
        $eventData["latitude"] = "something";
        $eventData["longitude"] = 54;
        $eventData["start_time"] = null;
        $eventData["date"] = null;

        $response = $this->post('/api/events', $eventData, [
            'X-XSRF-TOKEN' => $csrfToken,
            'Referer' => 'localhost:3000',
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(422)
         ->assertJson([
            'message' => 'The description field is required. (and 3 more errors)',
            'errors' => [
                'description' => [
                    'The description field is required.'
                ],
                'latitude' => [
                    'The latitude field must be a number.'
                ],
                'start_time' => [
                    'The start time field is required.'
                ],
                'date' => [
                    'The date field is required.'
                ]
            ]
         ]);
        
    }

    /**
     * Test un-authenticated request to storing a new event
     *
     * @return void
     */
    public function test_unauthenticated_request()
    {
        $userData = User::factory()->create()->toArray();

        // no login

        // event data
        $eventData["title"] = "My New Event";
        $eventData["description"] = "This is new event's description.";
        $eventData["latitude"] = 55;
        $eventData["longitude"] = 54;
        $eventData["start_time"] = '10:30';
        $eventData["date"] = '2023-05-10';

        $response = $this->post('/api/events', $eventData, [
            'Referer' => 'localhost:3000',
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(401);
        
    }

    private function login(array $userData): string
    {
        $response = $this->get('/sanctum/csrf-cookie');

        $csrfToken = $response->cookie('XSRF-TOKEN');

        $headers = [
            'X-XSRF-TOKEN' => $csrfToken,
            'Referer' => 'localhost:3000',
            'Accept' => 'application/json',
        ];

        $loginData = [
            'email' => $userData['email'],
            'password' => 'password',
        ];

        $response = $this->post('/login', $loginData, $headers);

        return $response->cookie('XSRF-TOKEN');
    }

}