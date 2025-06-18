import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const flashcardService = {
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
          { field: { Name: "front" } },
          { field: { Name: "back" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "next_review" } },
          { field: { Name: "interval" } },
          { field: { Name: "ease_factor" } }
        ]
      };

      const response = await apperClient.fetchRecords('flashcard', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Failed to fetch flashcards");
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
          { field: { Name: "front" } },
          { field: { Name: "back" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "next_review" } },
          { field: { Name: "interval" } },
          { field: { Name: "ease_factor" } }
        ]
      };

      const response = await apperClient.getRecordById('flashcard', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching flashcard with ID ${id}:`, error);
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
          { field: { Name: "front" } },
          { field: { Name: "back" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "next_review" } },
          { field: { Name: "interval" } },
          { field: { Name: "ease_factor" } }
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

      const response = await apperClient.fetchRecords('flashcard', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching flashcards by language:", error);
      return [];
    }
  },

  async getDueCards(language) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const now = new Date().toISOString()
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "language" } },
          { field: { Name: "front" } },
          { field: { Name: "back" } },
          { field: { Name: "category" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "next_review" } },
          { field: { Name: "interval" } },
          { field: { Name: "ease_factor" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "language",
                    operator: "EqualTo",
                    values: [language],
                    include: true
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "next_review",
                    operator: "LessThanOrEqualTo",
                    values: [now],
                    include: true
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('flashcard', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching due cards:", error);
      return [];
    }
  },

  async create(cardData) {
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
            Name: cardData.Name || cardData.front || "New Card",
            Tags: cardData.Tags || "",
            Owner: cardData.Owner || null,
            language: cardData.language || 'spanish',
            front: cardData.front,
            back: cardData.back,
            category: cardData.category || 'general',
            difficulty: cardData.difficulty || 0,
            next_review: cardData.next_review || new Date().toISOString(),
            interval: cardData.interval || 1,
            ease_factor: cardData.ease_factor || 2.5
          }
        ]
      };

      const response = await apperClient.createRecord('flashcard', params);

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
          toast.success("Flashcard created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating flashcard:", error);
      toast.error("Failed to create flashcard");
      return null;
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
      if (updates.front !== undefined) updateData.front = updates.front;
      if (updates.back !== undefined) updateData.back = updates.back;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
      if (updates.next_review !== undefined) updateData.next_review = updates.next_review;
      if (updates.interval !== undefined) updateData.interval = updates.interval;
      if (updates.ease_factor !== undefined) updateData.ease_factor = updates.ease_factor;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('flashcard', params);

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
          toast.success("Flashcard updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating flashcard:", error);
      toast.error("Failed to update flashcard");
      return null;
    }
  },

  async updateAfterReview(id, rating) {
    try {
      await delay(200)
      
      // Get current card data
      const card = await this.getById(id);
      if (!card) throw new Error('Card not found');

      let newInterval = card.interval || 1;
      let newEaseFactor = card.ease_factor || 2.5;

      // Simplified spaced repetition algorithm
      switch(rating) {
        case 'again': // 0
          newInterval = 1;
          newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
          break;
        case 'hard': // 1
          newInterval = Math.max(1, Math.round(newInterval * 1.2));
          newEaseFactor = Math.max(1.3, newEaseFactor - 0.15);
          break;
        case 'good': // 2
          newInterval = Math.round(newInterval * newEaseFactor);
          break;
        case 'easy': // 3
          newInterval = Math.round(newInterval * newEaseFactor * 1.3);
          newEaseFactor = newEaseFactor + 0.15;
          break;
      }

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

      const updates = {
        interval: newInterval,
        ease_factor: newEaseFactor,
        next_review: nextReviewDate.toISOString(),
        difficulty: (card.difficulty || 0) + (rating === 'again' ? 1 : rating === 'easy' ? -0.5 : 0)
      };

      return await this.update(id, updates);
    } catch (error) {
      console.error("Error updating flashcard after review:", error);
      toast.error("Failed to update flashcard");
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

      const response = await apperClient.deleteRecord('flashcard', params);

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
          toast.success("Flashcard deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast.error("Failed to delete flashcard");
      return false;
    }
  },

  async getStats(language) {
    try {
      await delay(200)
      const cards = await this.getByLanguage(language);
      const now = new Date();
      const due = cards.filter(c => new Date(c.next_review) <= now).length;
      const learned = cards.filter(c => (c.interval || 1) > 7).length;

      return {
        total: cards.length,
        due,
        learned,
        new: cards.filter(c => (c.interval || 1) === 1).length
      };
    } catch (error) {
      console.error("Error getting flashcard stats:", error);
      return {
        total: 0,
        due: 0,
        learned: 0,
        new: 0
      };
    }
  }
}