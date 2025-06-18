import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const speakingChallengeService = {
  async getAll() {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "language" } },
          { field: { Name: "prompt" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "completed_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching speaking challenges:", error);
      toast.error("Failed to fetch speaking challenges");
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "language" } },
          { field: { Name: "prompt" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "completed_at" } }
        ]
      };

      const response = await apperClient.getRecordById('speaking_challenge', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching speaking challenge with ID ${id}:`, error);
      return null;
    }
  },

  async getDailyChallenge(language) {
    try {
      await delay(250)
      const today = new Date().toDateString();

      // Get completed challenges for today
      const completedToday = await this.getCompletedChallenges(1);
      if (completedToday.length > 0 && new Date(completedToday[0].completed_at).toDateString() === today) {
        return { ...completedToday[0], isCompleted: true };
      }

      // Get available challenges for the language
      const languageChallenges = await this.getByLanguage(language);
      if (languageChallenges.length === 0) {
        return null;
      }

      // Return a random challenge for today
      const randomChallenge = languageChallenges[
        Math.floor(Math.random() * languageChallenges.length)
      ];

      return { ...randomChallenge, isCompleted: false };
    } catch (error) {
      console.error("Error getting daily challenge:", error);
      return null;
    }
  },

  async getByLanguage(language) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "language" } },
          { field: { Name: "prompt" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          {
            FieldName: "language",
            Operator: "EqualTo",
            Values: [language],
            Include: true
          }
        ]
      };

      const response = await apperClient.fetchRecords('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching speaking challenges by language:", error);
      return [];
    }
  },

  async create(challengeData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: challengeData.Name || "Speaking Challenge",
            Tags: challengeData.Tags || "",
            Owner: challengeData.Owner || null,
            language: challengeData.language || 'spanish',
            prompt: challengeData.prompt,
            difficulty: challengeData.difficulty || 'beginner',
            audio_url: challengeData.audio_url || null,
            completed_at: challengeData.completed_at || null
          }
        ]
      };

      const response = await apperClient.createRecord('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success("Speaking challenge created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating speaking challenge:", error);
      toast.error("Failed to create speaking challenge");
      return null;
    }
  },

  async completeChallenge(challengeId, audioBlob = null) {
    try {
      await delay(400)
      
      const updates = {
        completed_at: new Date().toISOString(),
        audio_url: audioBlob ? `data:audio/wav;base64,${Date.now()}` : null
      };

      const result = await this.update(challengeId, updates);
      if (result) {
        toast.success("Speaking challenge completed!");
        return result;
      }
      
      return null;
    } catch (error) {
      console.error("Error completing speaking challenge:", error);
      toast.error("Failed to complete speaking challenge");
      return null;
    }
  },

  async getCompletedChallenges(limit = 10) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "language" } },
          { field: { Name: "prompt" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "completed_at" } }
        ],
        where: [
          {
            FieldName: "completed_at",
            Operator: "HasValue",
            Values: [],
            Include: true
          }
        ],
        orderBy: [
          {
            fieldName: "completed_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching completed challenges:", error);
      return [];
    }
  },

  async getStreakInfo() {
    try {
      await delay(200)
      
      const completedChallenges = await this.getCompletedChallenges(100); // Get more for streak calculation
      
      // Calculate consecutive days with completed challenges
      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < completedChallenges.length; i++) {
        if (!completedChallenges[i].completed_at) continue;
        
        const completedDate = new Date(completedChallenges[i].completed_at);
        const daysDiff = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === i) {
          streak++;
        } else {
          break;
        }
      }

      return {
        currentStreak: streak,
        totalCompleted: completedChallenges.length,
        lastCompleted: completedChallenges.length > 0 ? completedChallenges[0].completed_at : null
      };
    } catch (error) {
      console.error("Error getting streak info:", error);
      return {
        currentStreak: 0,
        totalCompleted: 0,
        lastCompleted: null
      };
    }
  },

  async update(id, updates) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
      if (updates.language !== undefined) updateData.language = updates.language;
      if (updates.prompt !== undefined) updateData.prompt = updates.prompt;
      if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
      if (updates.audio_url !== undefined) updateData.audio_url = updates.audio_url;
      if (updates.completed_at !== undefined) updateData.completed_at = updates.completed_at;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success("Speaking challenge updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating speaking challenge:", error);
      toast.error("Failed to update speaking challenge");
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('speaking_challenge', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success("Speaking challenge deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting speaking challenge:", error);
      toast.error("Failed to delete speaking challenge");
      return false;
    }
  }
}